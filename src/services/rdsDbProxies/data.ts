import CloudGraph from '@cloudgraph/sdk'
import RDS, {
  DescribeDBProxiesResponse,
  DBProxy,
  DescribeDBProxiesRequest
} from 'aws-sdk/clients/rds'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'


const { logger } = CloudGraph
const lt = { ...awsLoggerText }
const serviceName = 'RDS DB Proxies'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listDBProxiesForRegion = async (rds: RDS): Promise<DBProxy[]> =>
  new Promise<DBProxy[]>(resolve => {
    const proxies: DBProxy[] = []
    const descDBProxiesOpts: DescribeDBProxiesRequest = {}
    const listProxies = (token?: string): void => {
      if (token) {
        descDBProxiesOpts.Marker = token
      }
      try {
        rds.describeDBProxies(
          descDBProxiesOpts,
          (err: AWSError, data: DescribeDBProxiesResponse) => {
            const { Marker, DBProxies = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'rds:describeDBProxies',
                err,
              })
            }

            proxies.push(...DBProxies)

            if (Marker) {
              listProxies(Marker)
            } else {
              resolve(proxies)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listProxies()
  })

export interface RawAwsRdsDbProxies extends DBProxy {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRdsDbProxies[] }> =>
  new Promise(async resolve => {
    const rdsData: RawAwsRdsDbProxies[] = []
    const regionPromises = []

    // Get all the proxies for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rds = new RDS({ ...config, region, endpoint })
        const subscriptions = await listDBProxiesForRegion(rds)

        if (!isEmpty(subscriptions)) {
          rdsData.push(
            ...subscriptions.map(subscription => ({
              ...subscription,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedRdsDbProxies(rdsData.length))

    errorLog.reset()
    resolve(groupBy(rdsData, 'region'))
  })
