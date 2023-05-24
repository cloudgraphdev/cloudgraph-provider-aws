import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import EKS, {
  Cluster,
  ListClustersRequest,
  ListClustersResponse,
  DescribeClusterRequest,
  DescribeClusterResponse,
  ListTagsForResourceResponse,
  ListNodegroupsRequest,
  ListNodegroupsResponse,
} from 'aws-sdk/clients/eks'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EKS cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 100

const listClustersForRegion = async ({
  eks,
  resolveRegion,
}: {
  eks: EKS
  resolveRegion: () => void
}): Promise<string[]> =>
  new Promise<string[]>(resolve => {
    const clusterList: string[] = []
    const listClustersOpts: ListClustersRequest = {}
    const listAllClusters = (token?: string): void => {
      listClustersOpts.maxResults = MAX_ITEMS
      if (token) {
        listClustersOpts.nextToken = token
      }
      try {
        eks.listClusters(
          listClustersOpts,
          (err: AWSError, data: ListClustersResponse) => {
            const { nextToken, clusters = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'eks:listClusters',
                err,
              })
            }
            /**
             * No clusters for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            clusterList.push(...clusters)

            if (nextToken) {
              logger.debug(lt.foundMoreEKSClusters(clusters.length))
              listAllClusters(nextToken)
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

const describeCluster = async (eks: EKS, name: string): Promise<Cluster> =>
  new Promise(resolve => {
    const descClusterOpts: DescribeClusterRequest = {
      name,
    }
    try {
      eks.describeCluster(
        descClusterOpts,
        (err: AWSError, data: DescribeClusterResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'eks:describeCluster',
              err,
            })
            return resolve({})
          }

          const { cluster = {} } = data || {}
          resolve(cluster)
        }
      )
    } catch (error) {
      resolve({})
    }
  })

const getResourceTags = async (eks: EKS, arn: string): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      eks.listTagsForResource(
        { resourceArn: arn },
        (err: AWSError, data: ListTagsForResourceResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'eks:listTagsForResource',
              err,
            })
            return resolve({})
          }

          const { tags = {} } = data || {}
          resolve(tags)
        }
      )
    } catch (error) {
      resolve({})
    }
  })

const listNodegroups = async ({
  eks,
  clusterName,
}: {
  eks: EKS
  clusterName: string
}): Promise<string[]> =>
  new Promise<string[]>(resolve => {
    const nodeGroupsList: string[] = []
    let args: ListNodegroupsRequest = { clusterName }
    const listAllNodeGroups = (token?: string): void => {
      if (token) {
        args = { ...args, nextToken: token }
      }

      try {
        eks.listNodegroups(
          args,
          (err: AWSError, data: ListNodegroupsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'eks:listNodegroups',
                err,
              })
            }

            /**
             * No node groups for this region
             */
            if (isEmpty(data)) {
              return resolve(nodeGroupsList)
            }

            const { nextToken, nodegroups } = data || {}

            nodeGroupsList.push(...nodegroups)

            if (nextToken) {
              listAllNodeGroups(nextToken)
            }

            resolve(nodeGroupsList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllNodeGroups()
  })

export interface RawAwsEksCluster extends Omit<Cluster, 'Tags'> {
  region: string
  Tags?: TagMap
  NodeGroups?: string[]
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsEksCluster[] }> =>
  new Promise(async resolve => {
    const eksData: RawAwsEksCluster[] = []
    const regionPromises = []
    const clusterPromises = []
    const tagsPromises = []
    const nodeGroupsPromises = []

    // get all clusters for all regions
    regions.split(',').map(region => {
      const eks = new EKS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const clusterList = await listClustersForRegion({
          eks,
          resolveRegion,
        })
        if (!isEmpty(clusterList)) {
          eksData.push(
            ...clusterList.map(cluster => ({
              name: cluster,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    // get all attributes for each cluster
    eksData.map(({ name, region }, idx) => {
      const eks = new EKS({ ...config, region, endpoint })
      const clusterPromise = new Promise<void>(async resolveCluster => {
        const clusterAttributes = await describeCluster(eks, name)
        eksData[idx] = {
          ...eksData[idx],
          ...clusterAttributes,
        }
        resolveCluster()
      })
      clusterPromises.push(clusterPromise)
    })

    await Promise.all(clusterPromises)

    // get all tags for each cluster
    eksData.map(({ arn, region }, idx) => {
      const eks = new EKS({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags: TagMap = await getResourceTags(eks, arn)
        eksData[idx].Tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    await Promise.all(tagsPromises)

    // get all node groups for each cluster
    eksData.map(({ name, region }, idx) => {
      const eks = new EKS({ ...config, region, endpoint })
      const nodeGroupsPromise = new Promise<void>(async resolveNodeGroups => {
        const nodeGroups: string[] = await listNodegroups({
          eks,
          clusterName: name,
        })
        eksData[idx].NodeGroups = nodeGroups
        resolveNodeGroups()
      })
      nodeGroupsPromises.push(nodeGroupsPromise)
    })

    await Promise.all(nodeGroupsPromises)
    errorLog.reset()

    resolve(groupBy(eksData, 'region'))
  })
