import { AwsEfsAccessPoint } from '../../types/generated'
import { RawAwsEfsAccessPoint } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEfsAccessPoint
  account: string
  region: string
}): AwsEfsAccessPoint => {
  const {
    Name: name,
    AccessPointArn: arn,
    AccessPointId: accessPointId,
  } = service

  return {
    id: accessPointId,
    arn,
    accountId: account,
    region,
    name,
  }
}
