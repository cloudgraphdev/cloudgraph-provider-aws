import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpcEndpoint } from './data'
import { AwsVpcEndpoint } from '../../types/generated'
import { vpcEndpointArn } from '../../utils/generateArns'

/**
 * Vpc Endpoint
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsVpcEndpoint
  account: string
  region: string
}): AwsVpcEndpoint => {
  const {
    VpcEndpointId: id,
    VpcEndpointType: type,
    ServiceName: serviceName,
    State: state,
    PolicyDocument: policyDocument,
    PrivateDnsEnabled: privateDnsEnabled,
    RequesterManaged: requesterManaged,
    CreationTimestamp: creationTimestamp,
    LastError: lastError = {},
    Tags: tags,
  } = rawData

  const vpcEndpoint = {
    id,
    accountId: account,
    arn: vpcEndpointArn({ region, account, id }),
    region,
    type,
    state,
    serviceName,
    policyDocument,
    privateDnsEnabled,
    requesterManaged,
    creationTimestamp: creationTimestamp?.toISOString(),
    lastErrorMessage: lastError?.Message || '',
    lastErrorCode: lastError?.Code || '',
    tags: formatTagsFromMap(tags),
  }

  return vpcEndpoint
}
