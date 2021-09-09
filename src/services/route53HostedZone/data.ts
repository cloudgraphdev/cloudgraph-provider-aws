import * as Sentry from '@sentry/node'

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

import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint = initTestEndpoint('Route53 Hosted Zones')

const listHostedZones = async (
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
            logger.error(err)
            Sentry.captureException(new Error(err.message))
          }

          /**
           * No Data for the region
           */

          if (isEmpty(data)) {
            resolveList()
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

/**
 * Route53 Hosted Zones
 */
export interface RawAwsRoute53HostedZone extends HostedZone {
  DelegationSet?: DelegationSet
  VPCs?: VPCs
  region: string
}

export default async ({
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsRoute53HostedZone[]
}> =>
  new Promise(async resolve => {
    const zoneIds: { Id: string }[] = []
    const hostedZonesData: RawAwsRoute53HostedZone[] = []

    const route53 = new Route53({ credentials, endpoint })

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
              logger.error(err)
              Sentry.captureException(new Error(err.message))
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

    logger.debug(lt.doneFetchingRoute53HostedZoneData)

    resolve(groupBy(hostedZonesData, 'region'))
  })
