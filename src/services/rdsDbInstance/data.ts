import CloudGraph from '@cloudgraph/sdk'
import RDS, {
  TagListMessage,
  DBInstance,
  DescribeDBInstancesMessage,
  DBInstanceMessage,
} from 'aws-sdk/clients/rds'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'
import { TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'

const { logger } = CloudGraph
const lt = { ...awsLoggerText }
const serviceName = 'RDS DB instance'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listDBInstancesForRegion = async (rds: RDS): Promise<DBInstance[]> =>
  new Promise<DBInstance[]>(resolve => {
    const dbInstanceList: DBInstance[] = []
    const descDBInstancesOpts: DescribeDBInstancesMessage = {}
    const listAllDBInstances = (token?: string): void => {
      if (token) {
        descDBInstancesOpts.Marker = token
      }
      try {
        rds.describeDBInstances(
          descDBInstancesOpts,
          (err: AWSError, data: DBInstanceMessage) => {
            const { Marker, DBInstances = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'rds:describeDBInstances',
                err,
              })
            }

            dbInstanceList.push(...DBInstances)

            if (Marker) {
              listAllDBInstances(Marker)
            } else {
              resolve(dbInstanceList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllDBInstances()
  })

const getResourceTags = async (rds: RDS, arn: string): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      rds.listTagsForResource(
        { ResourceName: arn },
        (err: AWSError, data: TagListMessage) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'rds:listTagsForResource',
              err,
            })
            return resolve({})
          }
          const { TagList: tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

export interface RawAwsRdsDbInstance extends DBInstance {
  Tags?: TagMap
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRdsDbInstance[] }> =>
  new Promise(async resolve => {
    const rdsData: RawAwsRdsDbInstance[] = []
    const regionPromises = []
    const tagsPromises = []

    // Get all the instances for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rds = new RDS({ ...config, region, endpoint })
        const instances = await listDBInstancesForRegion(rds)

        if (!isEmpty(instances)) {
          rdsData.push(
            ...instances.map(instance => ({
              ...instance,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedRdsInstances(rdsData.length))

    // get all tags for each instance
    rdsData.map(({ DBInstanceArn, region }, idx) => {
      const rds = new RDS({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        rdsData[idx].Tags = await getResourceTags(rds, DBInstanceArn)
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(rdsData, 'region'))
  })
