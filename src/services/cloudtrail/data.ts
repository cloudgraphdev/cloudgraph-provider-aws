import CloudTrail, {
  EventSelector,
  GetTrailStatusResponse,
  ResourceTag,
  Trail,
  TrailInfo,
} from 'aws-sdk/clients/cloudtrail'
import { Config } from 'aws-sdk/lib/config'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { TagMap } from '../../types'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'

const serviceName = 'CloudTrail'
const endpoint = initTestEndpoint(serviceName)

/**
 * CloudTrail
 */

export interface RawAwsCloudTrail extends Trail {
  TrailStatus: GetTrailStatusResponse
  EventSelectors: EventSelector[]
  Tags: TagMap
  region: string
}

const getTrailArnData = async (
  cloudTrail: CloudTrail,
  region: string
): Promise<string[]> => {
  try {
    const trailList: TrailInfo[] = []

    let trails = await cloudTrail.listTrails().promise()
    trailList.push(...trails.Trails)
    let nextToken = trails.NextToken
    while (nextToken) {
      trails = await cloudTrail
        .listTrails({
          NextToken: nextToken,
        })
        .promise()
      trailList.push(...trails.Trails)
      nextToken = trails.NextToken
    }
    const trailNameList = trailList
      .filter(trail => trail.HomeRegion === region)
      .map(trail => trail.TrailARN)
    return trailNameList
  } catch (err) {
    generateAwsErrorLog({
      serviceName,
      functionName: 'cloudTrail:getTrailArnData',
      err,
    })
  }
  return []
}

const listTrailData = async (
  cloudTrail: CloudTrail,
  trailArnList: string[]
): Promise<Trail[]> => {
  try {
    // If we dont have any trail arns, dont get trail data (this will return all trails and lead to dups)
    if (isEmpty(trailArnList)) {
      return []
    }
    const { trailList = [] } = await cloudTrail
      .describeTrails({
        trailNameList: trailArnList,
        includeShadowTrails: true,
      })
      .promise()
    return trailList
  } catch (err) {
    generateAwsErrorLog({
      serviceName,
      functionName: 'cloudTrail:listTrailData',
      err,
    })
  }
  return []
}

const listTrailTagData = async (
  cloudTrail: CloudTrail,
  ResourceIdList: string[]
): Promise<ResourceTag[]> => {
  const resourceTagList: ResourceTag[] = []
  for (const cloudTrailArn of ResourceIdList) {
    try {
      let resourceTags = await cloudTrail
        .listTags({ ResourceIdList: [cloudTrailArn] })
        .promise()
      resourceTagList.push(...resourceTags.ResourceTagList)
      let nextToken = resourceTags.NextToken
      while (nextToken) {
        resourceTags = await cloudTrail
          .listTags({
            ResourceIdList: [cloudTrailArn],
            NextToken: nextToken,
          })
          .promise()
        resourceTagList.push(...resourceTags.ResourceTagList)
        nextToken = resourceTags.NextToken
      }
    } catch (err) {
      generateAwsErrorLog({
        serviceName,
        functionName: 'cloudTrail:listTrailTagData',
        err,
      })
    }
  }
  return resourceTagList
}

const getTrailStatus = async (
  cloudTrail: CloudTrail,
  { Name }: Trail
): Promise<GetTrailStatusResponse | null> => {
  try {
    const data = await cloudTrail.getTrailStatus({ Name }).promise()
    return data
  } catch (err) {
    generateAwsErrorLog({
      serviceName,
      functionName: 'cloudTrail:getTrailStatus',
      err,
    })
  }
  return null
}

const getEventSelectors = async (
  cloudTrail: CloudTrail,
  { Name }: Trail
): Promise<EventSelector[]> => {
  try {
    const { EventSelectors: eventSelectors = [] } = await cloudTrail
      .getEventSelectors({ TrailName: Name })
      .promise()
    return eventSelectors
  } catch (err) {
    generateAwsErrorLog({
      serviceName,
      functionName: 'cloudTrail:getEventSelectors',
      err,
    })
  }
  return []
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCloudTrail[]
}> => {
  const cloudTrailData = []
  for (const region of regions.split(',')) {
    try {
      const cloudTrail = new CloudTrail({ ...config, region, endpoint })

      const trailArnList = await getTrailArnData(cloudTrail, region)
      const trailList = await listTrailData(cloudTrail, trailArnList)
      const trailTagList = await listTrailTagData(cloudTrail, trailArnList)

      if (!isEmpty(trailList)) {
        for (const trail of trailList) {
          const trailStatus = await getTrailStatus(cloudTrail, trail)
          const trailEvents = await getEventSelectors(cloudTrail, trail)

          cloudTrailData.push({
            ...trail,
            TrailStatus: trailStatus || {},
            EventSelectors: trailEvents,
            Tags: convertAwsTagsToTagMap(
              trailTagList
                .find(
                  (trailTag: ResourceTag) =>
                    trailTag.ResourceId === trail.TrailARN
                )
                ?.TagsList.map(tag => ({
                  Key: tag.Key,
                  Value: tag.Value || '',
                }))
            ),
            region,
          })
        }
      }
    } catch (err) {
      generateAwsErrorLog({
        serviceName,
        functionName: 'cloudTrail:listTrail',
        err,
      })
    }
  }

  return groupBy(cloudTrailData, 'region')
}
