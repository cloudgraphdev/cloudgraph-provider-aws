import { Config } from 'aws-sdk'
import { TaskSet } from 'aws-sdk/clients/ecs'
import CloudGraph from '@cloudgraph/sdk'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import EcsServiceClass from '../ecsService'
import { RawAwsEcsService } from '../ecsService/data'
import services from '../../enums/services'

export interface RawAwsEcsTaskSet extends TaskSet {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsEcsTaskSet[]
}> =>
  new Promise(async resolve => {
    const ecsTaskSets: RawAwsEcsTaskSet[] = []
    let ecsServices: RawAwsEcsService[] = []
    const existingData: RawAwsEcsService[] =
      flatMap(rawData.find(({ name }) => name === services.ecsService)?.data) ||
      []

    if (isEmpty(existingData)) {
      const ecsServiceClass = new EcsServiceClass({ logger: CloudGraph.logger })
      const serviceResult = await ecsServiceClass.getData({
        ...config,
        regions,
      })
      ecsServices = flatMap(serviceResult)
    } else {
      ecsServices = existingData
    }
    /**
     * Get all of the task sets for each service
     */
    ecsServices.map(({ taskSets, region }) => {
      if (!isEmpty(taskSets)) {
        ecsTaskSets.push(
          ...taskSets.map(taskSet => ({
            region,
            ...taskSet,
            Tags: convertAwsTagsToTagMap(taskSet.tags as AwsTag[]),
          }))
        )
      }
    })

    resolve(groupBy(ecsTaskSets, 'region'))
  })
