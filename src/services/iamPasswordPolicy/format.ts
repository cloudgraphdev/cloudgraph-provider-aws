import { PasswordPolicy } from 'aws-sdk/clients/iam'

import resources from '../../enums/resources'
import { AwsIamPasswordPolicy } from '../../types/generated'
import { getIamGlobalId } from '../../utils/ids'

/**
 * IAM Password Policy
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: PasswordPolicy
  account: string
  region: string
}): AwsIamPasswordPolicy => {
  const {
    MinimumPasswordLength: minimumPasswordLength = 0,
    MaxPasswordAge: maxPasswordAge = 0,
    PasswordReusePrevention: passwordReusePrevention = 0,
    RequireSymbols: requireSymbols = false,
    RequireNumbers: requireNumbers = false,
    RequireUppercaseCharacters: requireUppercaseCharacters = false,
    RequireLowercaseCharacters: requireLowercaseCharacters = false,
    AllowUsersToChangePassword: allowUsersToChangePassword = false,
    ExpirePasswords: expirePasswords = false,
    HardExpiry: hardExpiry = false,
  } = rawData

  return {
    id: getIamGlobalId({
      accountId: account,
      region,
      resourceType: resources.iamPasswordPolicy,
    }),
    accountId: account,
    minimumPasswordLength,
    maxPasswordAge,
    passwordReusePrevention,
    requireSymbols,
    requireNumbers,
    requireUppercaseCharacters,
    requireLowercaseCharacters,
    allowUsersToChangePassword,
    expirePasswords,
    hardExpiry,
  }
}
