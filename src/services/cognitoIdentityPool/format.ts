import { IdentityProviders } from 'aws-sdk/clients/cognitoidentity';
import t from '../../properties/translations'

import { AwsCognitoIdentityPool, AwsSupportedLoginProvider } from '../../types/generated';
import { formatTagsFromMap } from '../../utils/format';
import { RawAwsCognitoIdentityPool } from './data';

/**
 * Cognito Identity Pool
 */

const formatSupportedLoginProviders = (supportedLoginProviders: IdentityProviders): AwsSupportedLoginProvider[] => {
  const result: AwsSupportedLoginProvider[] = []
  if (supportedLoginProviders) {
    for (const [identityProvider, identityProviderId] of Object.entries(supportedLoginProviders)) {
      result.push({identityProvider, identityProviderId })
    }
  }
  return result
}

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsCognitoIdentityPool
  account: string
  region: string
}): AwsCognitoIdentityPool => {
  const {
    IdentityPoolId: identityPoolId,
    IdentityPoolName: identityPoolName,
    AllowUnauthenticatedIdentities: allowUnauthenticatedIdentities,
    AllowClassicFlow: allowClassicFlow,
    SupportedLoginProviders: supportedLoginProviders,
    DeveloperProviderName: developerProviderName,
    OpenIdConnectProviderARNs: openIdConnectProviderARNs,
    CognitoIdentityProviders: cognitoIdentityProviders,
    SamlProviderARNs: samlProviderARNs,
    Tags: identityPoolTags,
  } = rawData

  const cognitoIdentityProviderList = cognitoIdentityProviders?.map(({
    ProviderName: providerName,
    ClientId: clientId,
    ServerSideTokenCheck: serverSideTokenCheck,
  }) => { return {
    providerName,
    clientId,
    serverSideTokenCheck: serverSideTokenCheck? t.yes : t.no,
  }
  }) || []

  const identityPool  = {
    id: identityPoolId,
    accountId: account,
    identityPoolName,
    allowUnauthenticatedIdentities: allowUnauthenticatedIdentities? t.yes : t.no,
    allowClassicFlow: allowClassicFlow? t.yes : t.no,
    supportedLoginProviders: formatSupportedLoginProviders(supportedLoginProviders),
    developerProviderName,
    openIdConnectProviderARNs,
    cognitoIdentityProviders: cognitoIdentityProviderList,
    samlProviderARNs,
    tags: formatTagsFromMap(identityPoolTags),
    region,
  }

  return identityPool
}
