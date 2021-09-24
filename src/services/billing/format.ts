import { RawAwsBilling } from './data'
import { AwsBilling } from '../../types/generated'

const formatCostData = (costData: {
  [key: string]: string
}): { name: string; cost: string }[] =>
  Object.keys(costData).map(name => ({
    name,
    cost: costData[name],
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
    monthToDate = {},
    last30Days = {},
  } = service
  const formattedMonthToDate = formatCostData(monthToDate)
  const formattedLast30Days = formatCostData(last30Days)
  return {
    id: account,
    totalCostMonthToDate,
    totalCostLast30Days,
    monthToDate: formattedMonthToDate,
    last30Days: formattedLast30Days,
  }
}
