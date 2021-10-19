import isEmpty from 'lodash/isEmpty'
import { AwsIamGlobal } from '../../types/generated'
import { getIamGlobalId } from '../../utils/ids'
import { RawAwsIamGlobal } from './data'

/**
 * IAM Global Information
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsIamGlobal
  account: string
  region: string
}): AwsIamGlobal => {
  const {
    PasswordPolicy: passwordPolicy = {},
    ServerCertificates = [],
    OpenIdConnectProviders = [],
    SAMLProviders = [],
  } = rawData

  // Server Certificates
  const serverCertificates = []

  if (!isEmpty(ServerCertificates)) {
    ServerCertificates.map(certificate =>
      serverCertificates.push({
        id: certificate.ServerCertificateId,
        arn: certificate.Arn,
        name: certificate.ServerCertificateName,
        path: certificate.Path,
        uploadDate: certificate.UploadDate?.toISOString(),
        expiration: certificate.Expiration?.toISOString(),
      })
    )
  }

  // OpenId Connect Providers
  const openIdConnectProviders = []

  if (!isEmpty(OpenIdConnectProviders)) {
    OpenIdConnectProviders.map(({ Arn }) =>
      openIdConnectProviders.push({
        arn: Arn,
      })
    )
  }

  // SAML Providers
  const samlProviders = []

  if (!isEmpty(SAMLProviders)) {
    SAMLProviders.map(provider =>
      samlProviders.push({
        arn: provider.Arn,
        validUntil: provider.ValidUntil?.toISOString(),
        createdDate: provider.CreateDate?.toISOString(),
      })
    )
  }

  return {
    id: getIamGlobalId({
      accountId: account,
      region,
    }),
    accountId: account,
    passwordPolicy: {
      minimumPasswordLength: passwordPolicy?.MinimumPasswordLength || 0,
      maxPasswordAge: passwordPolicy?.MaxPasswordAge || 0,
      passwordReusePrevention: passwordPolicy?.PasswordReusePrevention || 0,
      requireSymbols: passwordPolicy?.RequireSymbols || false,
      requireNumbers: passwordPolicy?.RequireNumbers || false,
      requireUppercaseCharacters:
        passwordPolicy?.RequireUppercaseCharacters || false,
      requireLowercaseCharacters:
        passwordPolicy?.RequireLowercaseCharacters || false,
      allowUsersToChangePassword:
        passwordPolicy?.AllowUsersToChangePassword || false,
      expirePasswords: passwordPolicy?.ExpirePasswords || false,
      hardExpiry: passwordPolicy?.HardExpiry || false,
    },
    serverCertificates,
    openIdConnectProviders,
    samlProviders,
  }
}
