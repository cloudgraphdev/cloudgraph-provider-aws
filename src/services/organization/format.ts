import { generateUniqueId } from '@cloudgraph/sdk'
import { Organization } from 'aws-sdk/clients/organizations'
import { AwsOrganization } from '../../types/generated'

/**
 * Organization
 */

export default ({
  service: data,
  account,
}: {
  service: Organization
  account: string
}): AwsOrganization => {
  const {
    Id: id,
    Arn: arn,
    MasterAccountArn: masterAccountArn,
    MasterAccountId: masterAccountId,
    MasterAccountEmail: masterAccountEmail,
    FeatureSet: featureSet,
    AvailablePolicyTypes: availablePolicyTypes = [],
  } = data

  const policyTypes = availablePolicyTypes.map(
    ({ Status: status, Type: type }) => {
      return {
        id: generateUniqueId({
          arn,
          status,
          type,
        }),
        status,
        type,
      }
    }
  )

  const organization = {
    id,
    accountId: account,
    arn,
    masterAccountArn,
    masterAccountId,
    masterAccountEmail,
    featureSet,
    availablePolicyTypes: policyTypes,
  }

  return organization
}
