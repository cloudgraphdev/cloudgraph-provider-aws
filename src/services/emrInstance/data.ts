import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import EMR, {
  Cluster,
  Instance,
  ListInstancesInput,
  ListInstancesOutput,
} from 'aws-sdk/clients/emr'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { RawAwsEmrCluster, getEmrClusters } from '../emrCluster/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EMR instance'
const endpoint = initTestEndpoint(serviceName)

const getInstancesPerCluster = async (emr: EMR, clusterId: string) =>
  new Promise<Instance[]>(resolve => {
    const instanceList: Instance[] = []
    const listInstancesOpts: ListInstancesInput = { ClusterId: clusterId }
    const listInstances = (marker?: string) => {
      if (marker) {
        listInstancesOpts.Marker = marker
      }
      emr.listInstances(
        listInstancesOpts,
        (err: AWSError, data: ListInstancesOutput) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'emr:listInstances', err)
          }
          /**
           * No EMR instances data for this cluster
           */
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Instances = [], Marker: nextToken } = data

          instanceList.push(...Instances)

          if (nextToken) {
            logger.debug(lt.foundAnotherTwoThousandInstances(clusterId))
            listInstances(nextToken)
          }

          resolve(instanceList)
        }
      )
    }
    listInstances()
  })

export interface RawAwsEmrInstance extends Instance {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEmrInstance[]
}> =>
  new Promise(async resolve => {
    const emrInstances: RawAwsEmrInstance[] = []
    const emrClusters: RawAwsEmrCluster[] = []

    /**
     * Get all the EMR clusters for this region
     */
    let numOfClusters = 0
    await Promise.all(
      regions.split(',').map(
        region =>
          new Promise<void>(async resolveEmrClusters => {
            const emr = new EMR({ ...config, region, endpoint })
            const clusterList: Cluster[] = await getEmrClusters(emr, region)

            if (!isEmpty(clusterList)) {
              numOfClusters += clusterList.length
              emrClusters.push(...clusterList.map(cluster => ({
                Id: cluster.Id,
                region,
              })))
            }

            resolveEmrClusters()
          })
      )
    )
    logger.debug(lt.fetchedEmrClusters(numOfClusters))

    /**
   * Get the instances for each EMR cluster
   */
  let numOfInstances = 0
  const emrInstancePromises =
    emrClusters.map((cluster: RawAwsEmrCluster) =>
      new Promise<void>(async resolveInstances => {
        const emr = new EMR({ ...config, region: cluster.region, endpoint })
        const instances: Instance[] = await getInstancesPerCluster(
          emr,
          cluster.Id
        )

        if (!isEmpty(instances)) {
          numOfInstances += instances.length
          emrInstances.push(...instances.map(instance => ({
            region: cluster.region,
            ...instance,
          })))
        }

        resolveInstances()
      })
  )

  await Promise.all(emrInstancePromises)

  logger.debug(lt.fetchedEmrClusterInstances(numOfInstances))

  resolve(groupBy(emrInstances, 'region'))

  })