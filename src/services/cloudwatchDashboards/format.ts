import { AwsCloudwatchDashboard } from '../../types/generated'
import { RawAwsCloudwatchDashboard } from './data'

/**
 * CloudWatch Dashboard
 */
export default ({
  service,
  account,
  region,
}: {
  service: RawAwsCloudwatchDashboard
  account: string
  region: string
}): AwsCloudwatchDashboard => {
  const { DashboardName: name, DashboardArn: arn } = service
  return {
    id: name,
    accountId: account,
    arn,
    region,
  }
}
