import { RawAwsBilling, costInterface } from './data'
import { AwsBilling } from '../../types/generated'

const formatCostData = (costData: {
  [key: string]: costInterface
}): {
  name: string
  cost?: number
  currency?: string
  formattedCost?: string
}[] =>
  Object.keys(costData).map(name => ({
    name,
    ...costData[name],
  }))
/**
 * CloudWatch
 */
export default ({
  service,
  account,
}: {
  service: RawAwsBilling
  account: string
}): AwsBilling => {
  const {
    totalCostLast30Days,
    totalCostMonthToDate,
    last30DaysDailyAverage,
    monthToDateDailyAverage,
    monthToDate = {},
    last30Days = {},
  } = service
  const formattedMonthToDate = formatCostData(monthToDate)
  const formattedLast30Days = formatCostData(last30Days)
  const formattedLast30DailyAverage = formatCostData(last30DaysDailyAverage)
  const formattedMonthToDateDailyAverage = formatCostData(
    monthToDateDailyAverage
  )
  return {
    id: `billing:${account}`,
    accountId: account,
    totalCostMonthToDate,
    totalCostLast30Days,
    monthToDate: formattedMonthToDate,
    last30Days: formattedLast30Days,
    monthToDateDailyAverage: formattedMonthToDateDailyAverage,
    last30DaysDailyAverage: formattedLast30DailyAverage,
  }
}
