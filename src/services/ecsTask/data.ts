import { Config } from 'aws-sdk'
import ECS, { Task } from 'aws-sdk/clients/ecs'
import CloudGraph from '@cloudgraph/sdk'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'
import EcsClusterClass from '../ecsCluster'
import { RawAwsEcsCluster } from '../ecsCluster/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS task'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEcsTask extends Task {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEcsTask[]
}> =>
  new Promise(async resolve => {
    const ecsTasks: RawAwsEcsTask[] = []
    const ecsClusterClass = new EcsClusterClass({ logger: CloudGraph.logger })
    const clusterResult = await ecsClusterClass.getData({
      ...config,
      regions,
    })
    const ecsClusters: RawAwsEcsCluster[] = flatMap(clusterResult)

    /**
     * Get the arns of all the tasks
     */

    let ecsTaskArns: any = await Promise.all(
      ecsClusters.map(
        async ({ clusterName: cluster, region }) =>
          new Promise(resolveEcsData =>
            new ECS({ ...config, region, endpoint }).listTasks(
              { cluster },
              (err, data) => {
                if (err) {
                  errorLog.generateAwsErrorLog({
                    functionName: 'ecs:listTasks',
                    err,
                  })
                }

                if (isEmpty(data)) {
                  return resolveEcsData([])
                }

                const { taskArns = [] } = data

                resolveEcsData({ region, cluster, taskArns })
              }
            )
          )
      )
    )

    /**
     * Check to make sure there are tasks before we try and search for them
     */

    ecsTaskArns = ecsTaskArns
      .flat()
      .filter(({ taskArns }) => !isEmpty(taskArns))

    /**
     * Get all the details for each task
     */

    const ecsTaskPromises = ecsTaskArns.map(
      async ({ region, taskArns: tasks, cluster }) =>
        new Promise<void>(resolveEcsData =>
          new ECS({ ...config, region, endpoint }).describeTasks(
            { tasks, cluster },
            (err, data) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'ecs:describeTasks',
                  err,
                })
              }

              if (isEmpty(data)) {
                return resolveEcsData()
              }

              const { tasks = [] } = data

              logger.debug(lt.fetchedEcsTasks(tasks.length))

              ecsTasks.push(
                ...tasks.map(task => ({
                  region,
                  ...task,
                  Tags: convertAwsTagsToTagMap(task.tags as AwsTag[]),
                }))
              )

              resolveEcsData()
            }
          )
        )
    )

    await Promise.all(ecsTaskPromises)
    errorLog.reset()

    resolve(groupBy(ecsTasks, 'region'))
  })
