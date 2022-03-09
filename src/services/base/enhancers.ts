import { ProviderData } from '@cloudgraph/sdk'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { rawDataInterface } from '.'
import { regionMap } from '../../enums/regions'
import services from '../../enums/services'
import { checkAndMergeConnections } from '../../utils'
import addAccountConnections from '../account/connections'

/**
 * Data Enhancers
 */
export interface EnhancerConfig {
  rawData: rawDataInterface[]
  accounts: { id: string; accountId: string; regions: string[] }[]
  configuredRegions: string
  data: ProviderData
}

/**
 * Generates AWS services connections to Scanned accounts
 * @param {EnhancerConfig} accounts Scanned accounts
 * @param {EnhancerConfig} data AWS Services fetched data
 * @returns {ProviderData}
 */
export const connectAWSServicesToAccount = ({
  accounts,
  data,
}: EnhancerConfig): ProviderData => {
  let accountsConnections = {}
  for (const account of accounts) {
    const connections = addAccountConnections({
      service: account,
      data: data.entities,
    })
    accountsConnections = {
      ...accountsConnections,
      ...connections,
    }
  }
  return {
    entities: data.entities,
    connections: checkAndMergeConnections(
      data.connections,
      accountsConnections
    ),
  }
}

/**
 * Adds Billing data to EC2 instances
 * @param {EnhancerConfig}
 * @returns {ProviderData}
 */
export const enrichInstanceWithBillingData = ({
  rawData,
  configuredRegions,
  data: { entities, connections },
}: EnhancerConfig): ProviderData => {
  const billingRegion = regionMap.usEast1
  let result = entities
  if (configuredRegions.includes(billingRegion)) {
    const billingArray =
      rawData.find(({ name }) => name === services.billing)?.data?.[
        billingRegion
      ] ?? []
    for (const billing of billingArray) {
      const individualData: {
        [key: string]: {
          cost: number
          currency: string
          formattedCost: string
        }
      } = get(billing, ['individualData'], undefined)
      if (individualData) {
        for (const [key, value] of Object.entries(individualData)) {
          if (key.includes('natgateway') && !isEmpty()) {
            // this billing data is for natgateway, search for the instance
            const {
              name,
              mutation,
              data: nats,
            } = result.find(
              ({ name: instanceName }: { name: string }) =>
                instanceName === services.nat
            ) ?? {}
            if (!isEmpty(nats)) {
              const natsWithBilling = nats.map(val => {
                if (key.includes(val.id)) {
                  return {
                    ...val,
                    dailyCost: {
                      cost: value?.cost,
                      currency: value?.currency,
                      formattedCost: value?.formattedCost,
                    },
                  }
                }
                return val
              })
              result = result.filter(
                ({ name: serviceName }) => serviceName !== services.nat
              )
              result.push({
                name,
                mutation,
                data: natsWithBilling,
              })
            }
          }
          if (key.includes('i-')) {
            // this billing data is for ec2, search for the instance
            const {
              name,
              mutation,
              data: ec2s,
            } = result.find(
              ({ name: instanceName }: { name: string }) =>
                instanceName === services.ec2Instance
            ) ?? {}
            if (!isEmpty(ec2s)) {
              const ec2WithBilling = ec2s.map(val => {
                if (key === val.id) {
                  return {
                    ...val,
                    dailyCost: {
                      cost: value?.cost,
                      currency: value?.currency,
                      formattedCost: value?.formattedCost,
                    },
                  }
                }
                return val
              })
              result = result.filter(
                ({ name: serviceName }) => serviceName !== services.ec2Instance
              )
              result.push({
                name,
                mutation,
                data: ec2WithBilling,
              })
            }
          }
        }
      }
    }
  }
  return {
    entities: result,
    connections,
  }
}

export default [
  { name: 'billing', enhancer: enrichInstanceWithBillingData },
  { name: 'account', enhancer: connectAWSServicesToAccount },
]
