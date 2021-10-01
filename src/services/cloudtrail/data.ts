import { CloudTrail } from 'aws-sdk'
import { ResourceTag, Trail, TrailInfo } from 'aws-sdk/clients/cloudtrail'
import groupBy from 'lodash/groupBy'

import { Credentials, TagMap } from '../../types'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'

const serviceName = 'CloudTrail'
const endpoint = initTestEndpoint(serviceName)

/**
 * CloudTrail
 */

export interface RawAwsCloudTrail extends Trail {
  Tags: TagMap
  region: string
}

const getTrailArnData = async (
  cloudTrail: CloudTrail
): Promise<string[]> => {
  try {
    const trailList: TrailInfo[] = []

    let trails = await cloudTrail.listTrails().promise()
    trailList.push(...trails.Trails)
    let nextToken = trails.NextToken
    while (nextToken) {
      trails = await cloudTrail.listTrails({
        NextToken: nextToken,
      }).promise()
      trailList.push(...trails.Trails)
      nextToken = trails.NextToken
    }
    const trailNameList = trailList.map(trail => trail.TrailARN)
    
    return trailNameList
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cloudTrail:getTrailArnData', err)
  }
  return null
}

const listTrailData = async (
  cloudTrail: CloudTrail,
  trailArnList: string[],
): Promise<Trail[]> => {
  try {
    const fullResources = await cloudTrail.describeTrails({
      trailNameList: trailArnList,
      includeShadowTrails: true,
    }).promise()
    return fullResources.trailList
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cloudTrail:listTrailData', err)
  }
  return []
}

const listTrailTagData = async (
  cloudTrail: CloudTrail,
  ResourceIdList: string[], 
): Promise<ResourceTag[]> => {
  const resourceTagList: ResourceTag[] = []
  for (const cloudTrailArn of ResourceIdList) {
    try {
      let resourceTags = await cloudTrail.listTags(
        {ResourceIdList: [cloudTrailArn]}
      ).promise()
      resourceTagList.push(...resourceTags.ResourceTagList)
      let nextToken = resourceTags.NextToken
      while (nextToken) {
        resourceTags = await cloudTrail.listTags({
          ResourceIdList: [cloudTrailArn],
          NextToken: nextToken,
        }).promise()
        resourceTagList.push(...resourceTags.ResourceTagList)
        nextToken = resourceTags.NextToken
      }
    } catch (err) {
      generateAwsErrorLog(serviceName, 'cloudTrail:listTrailTagData', err)
    }
  }  
  return resourceTagList
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsCloudTrail[]
}> => {
  const cloudTrailData = []
  for (const region of regions.split(',')) {
    const cloudTrail = new CloudTrail({ region, credentials, endpoint })
  
    const trailArnList = await getTrailArnData(cloudTrail)
    const trailList = await listTrailData(cloudTrail, trailArnList)
    const trailTagList = await listTrailTagData(cloudTrail, trailArnList)

    cloudTrailData.push(
      ...trailList.map((trail: Trail) => ({
        ...trail,
        Tags: convertAwsTagsToTagMap(
          (trailTagList
            .find((trailTag: ResourceTag) =>
              trailTag.ResourceId === trail.TrailARN))?.TagsList
                .map(tag => ({
                  Key: tag.Key,
                  Value:tag.Value || '',
                })
          )
        ),
        region,
      }))
    )
    cloudTrail.listPublicKeys()
  }

  return groupBy(cloudTrailData, 'region')
}
