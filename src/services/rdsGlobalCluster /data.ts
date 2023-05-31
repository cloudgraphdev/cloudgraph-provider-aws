import CloudGraph from '@cloudgraph/sdk'
import RDS, {
  GlobalClustersMessage,
  DescribeGlobalClustersMessage,
  GlobalCluster,
} from 'aws-sdk/clients/rds'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'RDS DB cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listGlobalClustersForRegion = async (rds: RDS): Promise<GlobalCluster[]> =>
  new Promise<GlobalCluster[]>(resolve => {
    const clusterList: GlobalCluster[] = []
    const descClustersOpts: DescribeGlobalClustersMessage = {}
    const listAllClusters = (token?: string): void => {
      if (token) {
        descClustersOpts.Marker = token
      }
      try {
        rds.describeGlobalClusters(
          descClustersOpts,
          (err: AWSError, data: GlobalClustersMessage) => {
            const { Marker, GlobalClusters = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'rds:describeGlobalClusters',
                err,
              })
            }

            clusterList.push(...GlobalClusters)

            if (Marker) {
              listAllClusters(Marker)
            } else {
              resolve(clusterList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllClusters()
  })


export interface RawAwsRdsGlobalCluster extends GlobalCluster {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRdsGlobalCluster[] }> =>
  new Promise(async resolve => {
    const rdsData: RawAwsRdsGlobalCluster[] = []
    const regionPromises = []
    const tagsPromises = []

    // Get all the global clusters for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rds = new RDS({ ...config, region, endpoint })
        const clusters = await listGlobalClustersForRegion(rds)

        if (!isEmpty(clusters)) {
          rdsData.push(
            ...(await Promise.all(
              clusters.map(async cluster => ({
                ...cluster,
                region,
              }))
            ))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedRdsGlobalClusters(rdsData.length))
    errorLog.reset()
    resolve(groupBy(rdsData, 'region'))
  })
