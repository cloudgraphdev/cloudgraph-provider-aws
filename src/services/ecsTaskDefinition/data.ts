import { Config } from 'aws-sdk'
import ECS, { TaskDefinition } from 'aws-sdk/clients/ecs'
import CloudGraph from '@cloudgraph/sdk'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import EcsServiceClass from '../ecsService'
import { RawAwsEcsService } from '../ecsService/data'
import services from '../../enums/services'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS task definition'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEcsTaskDefinition extends TaskDefinition {
  region: string
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
  [region: string]: RawAwsEcsTaskDefinition[]
}> =>
  new Promise(async resolve => {
    const ecsTaskDefinitions: RawAwsEcsTaskDefinition[] = []
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
     * Get all of the containers for each instance arn
     */
    const ecsTaskDefinitionPromises = ecsServices.map(
      async ({ taskDefinition, region }) =>
        new Promise<void>(resolveEcsData => {
          new ECS({ ...config, region, endpoint }).describeTaskDefinition(
            { taskDefinition },
            (err, data) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'ecs:describeTaskDefinition',
                  err,
                })
              }

              if (isEmpty(data)) {
                return resolveEcsData()
              }

              const { taskDefinition = {} } = data

              ecsTaskDefinitions.push({
                region,
                ...taskDefinition,
              })

              resolveEcsData()
            }
          )
        })
    )

    await Promise.all(ecsTaskDefinitionPromises)
    errorLog.reset()

    logger.debug(lt.fetchedEcsTaskDefinitions(ecsTaskDefinitions.length))

    resolve(groupBy(ecsTaskDefinitions, 'region'))
  })
