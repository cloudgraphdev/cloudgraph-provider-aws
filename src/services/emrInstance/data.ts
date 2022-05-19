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
import flatMap from 'lodash/flatMap'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { RawAwsEmrCluster, getEmrClusters } from '../emrCluster/data'
import services from '../../enums/services'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EMR instance'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getInstancesPerCluster = async (
  emr: EMR,
  clusterId: string
): Promise<Instance[]> =>
  new Promise<Instance[]>(resolve => {
    const instanceList: Instance[] = []
    const listInstancesOpts: ListInstancesInput = { ClusterId: clusterId }
    const listInstances = (marker?: string): void => {
      if (marker) {
        listInstancesOpts.Marker = marker
      }

      try {
        emr.listInstances(
          listInstancesOpts,
          (err: AWSError, data: ListInstancesOutput) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'emr:listInstances',
                err,
              })
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
            } else {
              resolve(instanceList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listInstances()
  })

export interface RawAwsEmrInstance extends Instance {
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
  [region: string]: RawAwsEmrInstance[]
}> =>
  new Promise(async resolve => {
    const emrInstances: RawAwsEmrInstance[] = []
    let emrClusters: RawAwsEmrCluster[] = []
    const existingData: RawAwsEmrCluster[] =
      flatMap(rawData.find(({ name }) => name === services.emrCluster)?.data) ||
      []

    if (isEmpty(existingData)) {
      /**
       * Get all the EMR clusters for this region
       */
      await Promise.all(
        regions.split(',').map(
          region =>
            new Promise<void>(async resolveEmrClusters => {
              const emr = new EMR({ ...config, region, endpoint })
              const clusterList: Cluster[] = await getEmrClusters(emr, region)

              if (!isEmpty(clusterList)) {
                emrClusters.push(
                  ...clusterList.map(cluster => ({
                    Id: cluster.Id,
                    region,
                  }))
                )
              }

              resolveEmrClusters()
            })
        )
      )
    } else {
      // Uses existing data
      emrClusters = existingData
    }

    logger.debug(lt.fetchedEmrClusters(emrClusters.length))

    /**
     * Get the instances for each EMR cluster
     */
    let numOfInstances = 0
    const emrInstancePromises = emrClusters.map(
      (cluster: RawAwsEmrCluster) =>
        new Promise<void>(async resolveInstances => {
          const emr = new EMR({ ...config, region: cluster.region, endpoint })
          const instances: Instance[] = await getInstancesPerCluster(
            emr,
            cluster.Id
          )

          if (!isEmpty(instances)) {
            numOfInstances += instances.length
            emrInstances.push(
              ...instances.map(instance => ({
                region: cluster.region,
                ...instance,
              }))
            )
          }

          resolveInstances()
        })
    )

    await Promise.all(emrInstancePromises)

    errorLog.reset()
    logger.debug(lt.fetchedEmrClusterInstances(numOfInstances))

    resolve(groupBy(emrInstances, 'region'))
  })
