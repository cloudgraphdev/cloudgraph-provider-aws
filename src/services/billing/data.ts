import CloudGraph from '@cloudgraph/sdk'
import { AWSError, Request, Config } from 'aws-sdk'
import CE, {
  GetCostAndUsageResponse,
  GetDimensionValuesResponse,
} from 'aws-sdk/clients/costexplorer'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
import get from 'lodash/get'
import { regionMap } from '../../enums/regions'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'
import {
  getDaysAgo,
  getFirstDayOfMonth,
  getCurrentDayOfMonth,
  createDiffSecs,
} from '../../utils/dateutils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Billing'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export const getRoundedAmount = (amount: string): number =>
  Math.round((parseFloat(amount) + Number.EPSILON) * 100) / 100

export const formatAmmountAndUnit = ({
  Amount: amount = 0,
  Unit: currency = 'USD',
}: {
  Amount?: number
  Unit?: string
}): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    getRoundedAmount(amount.toString())
  )

export interface costInterface {
  cost?: number
  currency?: string
  formattedCost?: string
}
export interface RawAwsBilling {
  totalCostLast30Days: costInterface
  totalCostMonthToDate: costInterface
  monthToDateDailyAverage: { [key: string]: costInterface }
  last30DaysDailyAverage: { [key: string]: costInterface }
  monthToDate: { [key: string]: costInterface }
  last30Days: { [key: string]: costInterface }
  individualData: { [key: string]: costInterface }
}

const listAvailabeServices = ({
  costExplorer,
  resolveServices,
}: {
  costExplorer: CE
  resolveServices: (value: string[] | PromiseLike<string[]>) => void
}): Request<GetDimensionValuesResponse, AWSError> => {
  return costExplorer.getDimensionValues(
    {
      TimePeriod: { Start: getDaysAgo(30), End: getDaysAgo(0) },
      Dimension: 'SERVICE',
    },
    (err, data) => {
      /**
       * Error fetching the services list
       */
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'ce:getDimensionsValues',
          err,
        })
        return resolveServices([])
      }

      const { DimensionValues: dimensions = [] } = data || {}

      /**
       * The dimensions are for some reason empty when they should not be
       */

      if (isEmpty(dimensions)) {
        logger.debug(lt.unableToFindFinOpsServiceData)
        return resolveServices([])
      }

      resolveServices(dimensions.map(({ Value }) => Value))
    }
  )
}

/**
 * AWS Billing
 */
export default async ({
  config,
}: {
  config: Config
}): Promise<{ [key: string]: RawAwsBilling[] }> => {
  const startDate = new Date()
  const region = regionMap.usEast1
  const results: RawAwsBilling = {
    totalCostLast30Days: {},
    totalCostMonthToDate: {},
    monthToDateDailyAverage: {},
    last30DaysDailyAverage: {},
    monthToDate: {},
    last30Days: {},
    individualData: {},
  }
  const resultPromises = []
  logger.debug(lt.fetchingAggregateFinOpsData)
  try {
    const listAggregateFinOpsData = ({
      costExplorer,
      resolve,
      type,
      groupBy = true,
      timePeriod: TimePeriod,
    }: {
      costExplorer: CE
      resolve: (value: void | PromiseLike<void>) => void
      type: string
      groupBy?: boolean
      timePeriod: { Start: string; End: string }
    }): Request<GetCostAndUsageResponse, AWSError> => {
      const params: CE.GetCostAndUsageRequest = {
        Metrics: ['BlendedCost'],
        TimePeriod,
        Granularity: 'MONTHLY',
      }

      if (groupBy) {
        params.GroupBy = [{ Key: 'SERVICE', Type: 'DIMENSION' }]
      }

      logger.debug(lt.queryingAggregateFinOpsDataForRegion(region, type))

      return costExplorer.getCostAndUsage(params, (err, data) => {
        /**
         * Error fetching the cost data
         */
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ce:GetCostAndUsageReport',
            err,
          })
          return resolve()
        }

        const { ResultsByTime: resultsByTime = [] } = data || {}

        /**
         * The results are for some reason empty when they should not be
         */

        if (isEmpty(resultsByTime)) {
          logger.debug(lt.unableToFindFinOpsAggregateData)
          return resolve()
        }

        if (groupBy) {
          /**
           * Map over the list of returned services and extract the pricing data for the last month, format of data is:
           * { "Keys": [ "AWS CloudTrail"], "Metrics": { "BlendedCost": { "Amount": "0.1270885", "Unit": "USD" } } }
           */

          const services: CE.Groups = head(resultsByTime).Groups || []
          services.map(({ Keys, Metrics }: CE.Group) => {
            const { Amount = '', Unit = '' } = get(Metrics, 'BlendedCost', {
              Amount: '',
              Unit: '',
            }) || { Amount: '', Unit: '' }
            const cost = getRoundedAmount(Amount)
            results[type][head(Keys)] = {
              cost,
              currency: Unit,
              formattedCost: formatAmmountAndUnit({ Amount: cost, Unit }),
            }
          })
        } else {
          /**
           * No service data, everything is just aggregated together so it looks like this:
           * [ { Total: { BlendedCost: { Amount: '-0.2775129004', Unit: 'USD' } } } ... ]
           */

          let currency

          const cost = resultsByTime.reduce(
            (
              prev,
              { Total: { BlendedCost: blendedCost } = { BlendedCost: {} } }
            ) => {
              if (!currency) {
                currency = blendedCost.Unit
              }
              return prev + getRoundedAmount(blendedCost.Amount)
            },
            0
          )

          results[type] = {
            cost,
            currency,
            formattedCost: formatAmmountAndUnit({
              Amount: cost,
              Unit: currency,
            }),
          }
        }
        resolve()
      })
    }

    // Try to get individual entity data
    const listIndividualFinOpsData = ({
      costExplorer,
      resolve,
      services,
      timePeriod: TimePeriod,
    }: {
      costExplorer: CE
      resolve: (value: void | PromiseLike<void>) => void
      services: string[]
      timePeriod: { Start: string; End: string }
    }): Request<CE.GetCostAndUsageWithResourcesResponse, AWSError> => {
      logger.debug(lt.queryingIndividualFinOpsDataForRegion(region))

      /**
       * NOTES: This only currently with services that are compute (i.e. EC2) based such as instances
       * NAT Gateways, and Dedicated Hosts. Everything else comes back as having "NoResourceId" like:
       * { 'arn:aws:ec2:us-east-1:938345459433:dedicated-host/h-fssg93hq0400454': '$360.64',
       * 'i-0043545435j4535': '$0.01', NoResourceId: '$2,857.64'... }
       * More info here: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getCostAndUsageWithResources-property
       */

      return costExplorer.getCostAndUsageWithResources(
        {
          Metrics: ['BlendedCost'],
          TimePeriod,
          Granularity: 'DAILY',
          GroupBy: [{ Key: 'RESOURCE_ID', Type: 'DIMENSION' }],
          Filter: {
            Dimensions: {
              Key: 'SERVICE',
              Values: services,
            },
          },
        },
        (err, data) => {
          /**
           * Error fetching the cost data
           */
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ce:getCostAndUsageWithResources',
              err,
            })
            return resolve()
          }

          const { ResultsByTime: resultsByTime = [] } = data || {}

          /**
           * The results are for some reason empty when they should not be
           */

          if (isEmpty(resultsByTime)) {
            logger.debug(lt.unableToFindFinOpsIndividualData)
            return resolve()
          }

          const resources: CE.Groups = head(resultsByTime).Groups || []
          resources.map(({ Keys, Metrics }: CE.Group) => {
            const { Amount, Unit } = get(Metrics, 'BlendedCost', {
              Amount: '',
              Unit: '',
            }) || { Amount: '', Unit: '' }
            const cost = getRoundedAmount(Amount)
            results.individualData[head(Keys)] = {
              cost,
              currency: Unit,
              formattedCost: formatAmmountAndUnit({ Amount: cost, Unit }),
            }
          })

          resolve()
        }
      )
    }

    /**
     * Now we make 4 queries to the api in order to get aggregate pricing data sliced in various ways
     * Note that this API is only availavbe in the us-east-1
     */

    const costExplorer = new CE({ ...config, region, endpoint })
    const today = new Date().toLocaleDateString('en-ca') // We use en-ca to ensure the correct date structure for CE
    const startOfMonth = getFirstDayOfMonth()

    const commonArgs = {
      costExplorer,
      timePeriod: {
        Start: getDaysAgo(30),
        End: today,
      },
    }

    /**
     * Breakdown by service types and spend for last 30 days
     */
    const last30DaysData = new Promise<void>(resolve =>
      listAggregateFinOpsData({
        ...commonArgs,
        resolve,
        type: 'last30Days',
      })
    )

    resultPromises.push(last30DaysData)

    /**
     * Breakdown by service types and spend since the beginning of the month
     */
    if (!(today === startOfMonth)) {
      const monthToDateData = new Promise<void>(resolve =>
        listAggregateFinOpsData({
          costExplorer,
          resolve,
          type: 'monthToDate',
          timePeriod: {
            Start: startOfMonth,
            End: today,
          },
        })
      )
      resultPromises.push(monthToDateData)
    }

    /**
     * The single total cost of everything in the last 30 days
     */
    const totalCostLast30Days = new Promise<void>(resolve =>
      listAggregateFinOpsData({
        ...commonArgs,
        resolve,
        type: 'totalCostLast30Days',
        groupBy: false,
      })
    )
    resultPromises.push(totalCostLast30Days)

    /**
     * The single total cost of everything in the current month
     */
    if (!(today === startOfMonth)) {
      const totalCostMonthToDate = new Promise<void>(resolve =>
        listAggregateFinOpsData({
          ...commonArgs,
          resolve,
          type: 'totalCostMonthToDate',
          groupBy: false,
          timePeriod: {
            Start: startOfMonth,
            End: today,
          },
        })
      )
      resultPromises.push(totalCostMonthToDate)
    }

    const individualDataPromise = new Promise<void>(async resolve => {
      return listIndividualFinOpsData({
        costExplorer,
        services: await new Promise(resolveServices =>
          listAvailabeServices({ costExplorer, resolveServices })
        ),
        timePeriod: {
          Start: getDaysAgo(1), // i.e. get the daily cost
          End: new Date().toLocaleDateString('en-ca'), // We use en-ca to ensure correct date structure for CE
        },
        resolve,
      })
    })

    resultPromises.push(individualDataPromise)

    await Promise.all(resultPromises)

    /**
     * Create Daily Averages
     */

    const createDailyAverage = ({
      days,
      resultMonthlyData,
      resultAverageData,
    }): void[] =>
      Object.keys(resultMonthlyData).map(service => {
        const { cost: aggregateCost, currency } = resultMonthlyData[service]
        const cost = parseFloat((aggregateCost / days).toFixed(2))
        results[resultAverageData][service] = {
          cost,
          currency,
          formattedCost: formatAmmountAndUnit({ Amount: cost, Unit: currency }),
        }
      })

    if (!isEmpty(results.monthToDate)) {
      createDailyAverage({
        days: parseInt(getCurrentDayOfMonth(), 10),
        resultMonthlyData: results.monthToDate,
        resultAverageData: 'monthToDateDailyAverage',
      })
    }
    if (!isEmpty(results.last30Days)) {
      createDailyAverage({
        days: 30,
        resultMonthlyData: results.last30Days,
        resultAverageData: 'last30DaysDailyAverage',
      })
    }
    logger.debug(lt.doneFetchingAggregateFinOpsData(createDiffSecs(startDate)))
    errorLog.reset()

    return { [region]: [results] }
  } catch (e) {
    logger.error(`There was an issue resolving data for ${serviceName}`)
    logger.debug(e)
    return {}
  }
}
