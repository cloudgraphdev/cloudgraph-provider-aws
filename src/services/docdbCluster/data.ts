import CloudGraph from '@cloudgraph/sdk'
import DOCDB, {
  DBCluster,
  DBClusterMessage,
  DBSubnetGroup,
  DBSubnetGroupMessage,
  DescribeDBClustersMessage,
} from 'aws-sdk/clients/docdb'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'DOC DB cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listClustersForRegion = async (docdb: DOCDB): Promise<DBCluster[]> =>
  new Promise<DBCluster[]>(resolve => {
    const clusterList: DBCluster[] = []
    const descClustersOpts: DescribeDBClustersMessage = {}
    const listAllClusters = (token?: string): void => {
      if (token) {
        descClustersOpts.Marker = token
      }
      try {
        docdb.describeDBClusters(
          descClustersOpts,
          (err: AWSError, data: DBClusterMessage) => {
            const { Marker, DBClusters = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'docdb:describeDBClusters',
                err,
              })
            }

            clusterList.push(...DBClusters)

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

const describeDBSubnetGroups = async (
  docdb: DOCDB,
  DBSubnetGroupName: string
): Promise<DBSubnetGroup[]> =>
  new Promise(resolve => {
    try {
      docdb.describeDBSubnetGroups(
        { DBSubnetGroupName },
        (err: AWSError, data: DBSubnetGroupMessage) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'docdb:describeDBSubnetGroups',
              err,
            })
            return resolve([])
          }
          if (isEmpty(data)) {
            return resolve([])
          }
          const { DBSubnetGroups = [] } = data || {}
          if (isEmpty(DBSubnetGroups)) {
            return resolve([])
          }
          resolve(DBSubnetGroups)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export interface RawAwsDocDBCluster extends DBCluster {
  DbSubnetGroups: DBSubnetGroup[]
  Tags?: TagMap
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsDocDBCluster[] }> =>
  new Promise(async resolve => {
    const docDBData: RawAwsDocDBCluster[] = []
    const regionPromises = []

    // Get all the clusters for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const docdb = new DOCDB({ ...config, region, endpoint })
        const clusters = await listClustersForRegion(docdb)

        if (!isEmpty(clusters)) {
          docDBData.push(
            ...(await Promise.all(
              clusters.map(async cluster => ({
                ...cluster,
                DbSubnetGroups: await describeDBSubnetGroups(
                  docdb,
                  cluster.DBSubnetGroup
                ),
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
    logger.debug(lt.fetchedDocdbClusters(docDBData.length))
    errorLog.reset()

    resolve(groupBy(docDBData, 'region'))
  })
