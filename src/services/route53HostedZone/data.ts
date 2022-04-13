import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import Route53, {
  DelegationSet,
  GetHostedZoneResponse,
  HostedZone,
  ListHostedZonesRequest,
  ListHostedZonesResponse,
  VPCs,
} from 'aws-sdk/clients/route53'
import { Config } from 'aws-sdk/lib/config'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { ROUTE_53_CUSTOM_DELAY } from '../../config/constants'
import { globalRegionName } from '../../enums/regions'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Route53 Hosted Zones'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: ROUTE_53_CUSTOM_DELAY,
})

export interface RawAwsRoute53HostedZone extends HostedZone {
  DelegationSet?: DelegationSet
  VPCs?: VPCs
  region: string
}

export const listHostedZones = async (
  route53: Route53,
  hostedZonesIds: { Id: string }[]
) =>
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
            errorLog.generateAwsErrorLog({
              functionName: 'route53:listHostedZones',
              err,
            })
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
          } = data || {}

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
            return resolveList()
          }
        }
      )
    }
    listZones()
  })

export const getHostedZoneData = async (
  route53: Route53,
  hostedZonesIds: { Id: string }[],
  hostedZonesData: RawAwsRoute53HostedZone[]
) =>
  Promise.all(
    hostedZonesIds.map(({ Id }) => {
      const zonePromise = new Promise<void>(resolveZone =>
        route53.getHostedZone(
          { Id },
          (err: AWSError, data: GetHostedZoneResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'route53:getHostedZone',
                err,
              })
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
              region: globalRegionName,
            })

            return resolveZone()
          }
        )
      )
      return zonePromise
    })
  )

/**
 * Route53 Hosted Zones
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsRoute53HostedZone[]
}> =>
  new Promise(async resolve => {
    const zoneIds: { Id: string }[] = []
    const hostedZonesData: RawAwsRoute53HostedZone[] = []

    const route53 = new Route53({
      ...config,
      endpoint,
      ...customRetrySettings,
    })

    /**
     * Step 1) for all regions, list all the hosted zones
     */
    await listHostedZones(route53, zoneIds)

    /**
     * Step 2) now that we have all of the hosted zones, get the individual zone data
     */

    await getHostedZoneData(route53, zoneIds, hostedZonesData)

    errorLog.reset()
    logger.debug(lt.doneFetchingRoute53HostedZoneData)

    resolve(groupBy(hostedZonesData, 'region'))
  })
