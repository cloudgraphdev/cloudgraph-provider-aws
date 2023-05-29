import CloudGraph from '@cloudgraph/sdk'
import RDS, {
  EventSubscription,
  EventSubscriptionsMessage,
  DescribeEventSubscriptionsMessage
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
const serviceName = 'RDS Event Subscriptions'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listDBEventSubscriptionsForRegion = async (rds: RDS): Promise<EventSubscription[]> =>
  new Promise<EventSubscription[]>(resolve => {
    const eventSubscriptions: EventSubscription[] = []
    const descDBInstancesOpts: DescribeEventSubscriptionsMessage = {}
    const listEventSubscriptions = (token?: string): void => {
      if (token) {
        descDBInstancesOpts.Marker = token
      }
      try {
        rds.describeEventSubscriptions(
          descDBInstancesOpts,
          (err: AWSError, data: EventSubscriptionsMessage) => {
            const { Marker, EventSubscriptionsList = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'rds:describeEventSubscriptions',
                err,
              })
            }

            eventSubscriptions.push(...EventSubscriptionsList)

            if (Marker) {
              listEventSubscriptions(Marker)
            } else {
              resolve(eventSubscriptions)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listEventSubscriptions()
  })

export interface RawAwsRdsEventSubscription extends EventSubscription {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRdsEventSubscription[] }> =>
  new Promise(async resolve => {
    const rdsData: RawAwsRdsEventSubscription[] = []
    const regionPromises = []

    // Get all the instances for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rds = new RDS({ ...config, region, endpoint })
        const subscriptions = await listDBEventSubscriptionsForRegion(rds)

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
    logger.debug(lt.fetchedRdsEventSubscriptions(rdsData.length))

    errorLog.reset()
    resolve(groupBy(rdsData, 'region'))
  })
