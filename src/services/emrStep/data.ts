import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import EMR, {
  Cluster,
  ClusterSummary,
  ListStepsInput,
  ListStepsOutput,
  Step,
} from 'aws-sdk/clients/emr'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import flatMap from 'lodash/flatMap'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { RawAwsEmrCluster, getEmrClusters } from '../emrCluster/data'
import services from '../../enums/services'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EMR instance'
const endpoint = initTestEndpoint(serviceName)

const listEmrClusterSteps = async (emr: EMR, clusterId: string) =>
  new Promise<Step[]>(resolve => {
    const clusterStepList: ClusterSummary[] = []
    const listStepsOpts: ListStepsInput = { ClusterId: clusterId }
    const listSteps = (marker?: string) => {
      emr.listSteps(listStepsOpts, (err: AWSError, data: ListStepsOutput) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'emr:listSteps', err)
        }
        /**
         * No EMR step data for this region
         */
        if (isEmpty(data)) {
          return resolve([])
        }

        const { Steps = [], Marker: nextToken } = data

        clusterStepList.push(...Steps)

        if (nextToken) {
          logger.debug(lt.foundAnotherFiftySteps(clusterId))
          listSteps(nextToken)
        }

        resolve(clusterStepList)
      })
    }
    listSteps()
  })

export interface RawAwsEmrStep extends Step {
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
  [region: string]: RawAwsEmrStep[]
}> => new Promise(async resolve => {
  const emrSteps: RawAwsEmrStep[] = []
  let emrClusters: RawAwsEmrCluster[] = []
  const existingData: RawAwsEmrCluster[] =
  flatMap(
    rawData.find(({ name }) => name === services.emrCluster)?.data
  ) || []

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
              emrClusters.push(...clusterList.map(cluster => ({
                Id: cluster.Id,
                region,
              })))
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
   * Get the list of steps for each EMR cluster
   */
  let numOfSteps = 0
  const stepPromises =
    emrClusters.map((cluster: RawAwsEmrCluster) =>
      new Promise<void>(async resolveSteps => {
        const emr = new EMR({ ...config, region: cluster.region, endpoint })
        const steps: Step[] = await listEmrClusterSteps(emr, cluster.Id)

        if (!isEmpty(steps)) {
          numOfSteps += steps.length
          emrSteps.push(...steps.map(step => ({
            region: cluster.region,
            ...step,
          })))
        }

        resolveSteps()
      })
    )

  await Promise.all(stepPromises)

  logger.debug(lt.fetchedEmrClusterSteps(numOfSteps))

  resolve(groupBy(emrSteps, 'region'))

  })