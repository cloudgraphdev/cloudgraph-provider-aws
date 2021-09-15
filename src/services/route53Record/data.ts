import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import Route53, {
  GetHostedZoneResponse,
  ListHostedZonesRequest,
  ListHostedZonesResponse,
  ListResourceRecordSetsRequest,
  ListResourceRecordSetsResponse,
  ResourceRecordSet,
} from 'aws-sdk/clients/route53'

import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { RawAwsRoute53HostedZone } from '../route53HostedZone/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Route53 Records'
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsRoute53Record extends ResourceRecordSet {
  HostedZoneId: string
  region: string
}

const listHostedZones = async (
  route53: Route53,
  hostedZonesIds: { Id: string }[]
): Promise<any> =>
  new Promise<void>(async resolveList => {
    const listZonesOpts: ListHostedZonesRequest = {}
    const listZones = (marker?: string) => {
      if (marker) {
        listZonesOpts.Marker = marker
      }
      route53.listHostedZones(
        listZonesOpts,
        async (err: AWSError, data: ListHostedZonesResponse) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'route53:listHostedZones', err)
          }

          /**
           * No Data for the region
           */

          if (isEmpty(data)) {
            return resolveList()
          }

          const {
            HostedZones: zones = [],
            NextMarker: marker,
            IsTruncated: truncated,
          } = data

          logger.debug(lt.fetchedRoute53Zones(zones.length))

          /**
           * Check to see if there are more
           */

          if (truncated) {
            listZones(marker)
          }

          /**
           * If there are not, then add these to the zoneIds
           */
          hostedZonesIds.push(...zones.map(({ Id }) => ({ Id })))

          /**
           * If this is the last page of data then return the zones
           */

          if (!truncated) {
            resolveList()
          }
        }
      )
    }
    listZones()
  })

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
        generateAwsErrorLog(serviceName, 'route53:listResourceRecordSets', err)
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
        recordData.push({ ...record, HostedZoneId, region: 'global' })
      }

      /**
       * If this is the last page of data then return
       */

      if (!truncated) {
        resolveRecords()
      }
    }
  )
}

/**
 * Route53 Records
 */

export default async ({
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsRoute53Record[]
}> =>
  new Promise(async resolve => {
    const zoneIds: { Id: string }[] = []
    const hostedZonesData: RawAwsRoute53HostedZone[] = []
    const recordData: RawAwsRoute53Record[] = []

    const route53 = new Route53({ region: 'us-east-1', credentials, endpoint })

    /**
     * Step 1) for all regions, list all the hosted zones
     */
    await listHostedZones(route53, zoneIds)

    /**
     * Step 2) now that we have all of the hosted zones, get the individual zone data
     */
    const zonePromises = zoneIds.map(({ Id }) => {
      const zonePromise = new Promise<void>(resolveZone =>
        route53.getHostedZone(
          { Id },
          (err: AWSError, data: GetHostedZoneResponse) => {
            if (err) {
              generateAwsErrorLog(serviceName, 'route53:getHostedZone', err)
            }

            /**
             * No Data for the region
             */

            if (isEmpty(data)) {
              return resolveZone()
            }

            /**
             * Add this zone to the zoneData and return
             */
            hostedZonesData.push({
              ...data.HostedZone,
              DelegationSet: data.DelegationSet,
              VPCs: data.VPCs,
              region: 'global',
            })

            resolveZone()
          }
        )
      )
      return zonePromise
    })

    await Promise.all(zonePromises)

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

    logger.debug(lt.doneFetchingRoute53RecordsData)

    resolve(groupBy(recordData, 'region'))
  })
