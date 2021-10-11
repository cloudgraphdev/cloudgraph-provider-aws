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
const {logger} = CloudGraph
import awsLoggerText from '../../properties/logger'
import { Credentials, TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
const lt = { ...awsLoggerText }

import { generateAwsErrorLog, initTestEndpoint } from '../../utils'

const serviceName = 'RDS DB instance'
const endpoint = initTestEndpoint(serviceName)

const listDBInstancesForRegion = async rds =>
  new Promise<DBInstance[]>(resolve => {
    const dbInstanceList: DBInstance[] = []
    const descDBInstancesOpts: DescribeDBInstancesMessage = {}
    const listAllDBInstances = (token?: string) => {
      if (token) {
        descDBInstancesOpts.Marker = token
      }
      try {
        rds.describeDBInstances(
          descDBInstancesOpts,
          (err: AWSError, data: DBInstanceMessage) => {
            const { Marker, DBInstances = [] } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'rds:describeDBInstances', err)
            }

            dbInstanceList.push(...DBInstances)

            if (Marker) {
              listAllDBInstances(Marker)
            }

            resolve(dbInstanceList)
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
            generateAwsErrorLog(serviceName, 'rds:listTagsForResource', err)
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

export interface RawAwsRDSDBInstance extends DBInstance {
  tags?: TagMap
  region: string
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: RawAwsRDSDBInstance[] }> =>
  new Promise(async resolve => {
    const rdsData: RawAwsRDSDBInstance[] = []
    const regionPromises = []
    const tagsPromises = []

    // Get all the instances for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rds = new RDS({ region, credentials, endpoint })
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
    logger.info(lt.fetchedRdsInstances(rdsData.length))

    // get all tags for each instance
    rdsData.map(({ DBInstanceArn, region }, idx) => {
      const rds = new RDS({ region, credentials, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        rdsData[idx].tags = await getResourceTags(rds, DBInstanceArn)
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    await Promise.all(tagsPromises)

    resolve(groupBy(rdsData, 'region'))
  })
