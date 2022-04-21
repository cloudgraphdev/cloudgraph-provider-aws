import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import flatMap from 'lodash/flatMap'

import { AWSError } from 'aws-sdk/lib/error'
import Route53, {
  ListResourceRecordSetsRequest,
  ListResourceRecordSetsResponse,
  ResourceRecordSet,
} from 'aws-sdk/clients/route53'
import { Config } from 'aws-sdk/lib/config'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import {
  getHostedZoneData,
  listHostedZones,
  RawAwsRoute53HostedZone,
} from '../route53HostedZone/data'
import { ROUTE_53_CUSTOM_DELAY } from '../../config/constants'
import services from '../../enums/services'
import { globalRegionName } from '../../enums/regions'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Route53 Records'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: ROUTE_53_CUSTOM_DELAY,
})

export interface RawAwsRoute53Record extends ResourceRecordSet {
  HostedZoneId: string
  region: string
}

const listRecordsForHostedZone = async ({
  route53,
  recordData,
  HostedZoneId,
  resolveRecords,
  StartRecordName = '',
  StartRecordType = '',
}: {
  route53: Route53
  recordData: RawAwsRoute53Record[]
  HostedZoneId: string
  StartRecordName?: string
  StartRecordType?: string
  resolveRecords: () => void
}): Promise<void | any> => {
  let args: ListResourceRecordSetsRequest = { HostedZoneId }

  if (StartRecordName) {
    args = {
      ...args,
      StartRecordName,
      StartRecordType,
    }
  }

  return route53.listResourceRecordSets(
    args,
    async (err: AWSError, data: ListResourceRecordSetsResponse) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'route53:listResourceRecordSets',
          err,
        })
      }

      /**
       * No records
       */

      if (isEmpty(data)) {
        return resolveRecords()
      }

      const {
        ResourceRecordSets: records = [],
        IsTruncated: truncated,
        NextRecordName: StartRecordName,
        NextRecordType: StartRecordType,
      } = data

      logger.debug(lt.fetchedRoute53ZonesRecords(records.length, HostedZoneId))

      /**
       * No records found
       */

      if (isEmpty(records)) {
        return resolveRecords()
      }

      /**
       * Check to see if there are more
       */

      if (truncated) {
        listRecordsForHostedZone({
          route53,
          recordData,
          HostedZoneId,
          resolveRecords,
          StartRecordName,
          StartRecordType,
        })
      }

      /**
       * If there are not, then add the records to the zone's records
       */
      for (const record of records) {
        recordData.push({ ...record, HostedZoneId, region: globalRegionName })
      }

      /**
       * If this is the last page of data then return
       */

      if (!truncated) {
        return resolveRecords()
      }
    }
  )
}

/**
 * Route53 Records
 */

export default async ({
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsRoute53Record[]
}> =>
  new Promise(async resolve => {
    const zoneIds: { Id: string }[] = []
    let hostedZonesData: RawAwsRoute53HostedZone[] = []
    const recordData: RawAwsRoute53Record[] = []

    const route53 = new Route53({
      ...config,
      endpoint,
      ...customRetrySettings,
    })
    const existingData: RawAwsRoute53HostedZone[] =
      flatMap(
        rawData.find(({ name }) => name === services.route53HostedZone)?.data
      ) || []

    if (isEmpty(existingData)) {
      // Refresh data
      await listHostedZones(route53, zoneIds)
      await getHostedZoneData(route53, zoneIds, hostedZonesData)
    } else {
      // Uses existing data
      hostedZonesData = existingData
    }

    /**
     * Step 3, get all the records for each zone
     */

    const recordPromises = hostedZonesData.map(zone => {
      const { Id: HostedZoneId } = zone
      const recordsPromise = new Promise<void>(resolveRecords =>
        listRecordsForHostedZone({
          route53,
          recordData,
          HostedZoneId,
          resolveRecords,
        })
      )
      return recordsPromise
    })

    await Promise.all(recordPromises)

    errorLog.reset()
    logger.debug(lt.doneFetchingRoute53RecordsData)

    resolve(groupBy(recordData, 'region'))
  })
