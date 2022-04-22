import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { RawAwsCognitoIdentityPool } from './data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * Cognito Identity Pool
 */

export default ({
  service: identityPool,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsCognitoIdentityPool
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    IdentityPoolId: id,
    identityPoolRoles,
    SamlProviderARNs = [],
    OpenIdConnectProviderARNs = [],
  } = identityPool

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)

  const iamRoleArns = Object.values(identityPoolRoles?.Roles || {})

  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(role =>
      iamRoleArns.includes(role.Arn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  /**
   * Find iamSamlProvider
   * related to this cognito identity pool
   */
  const iamSamlProviders = data.find(({ name }) => name === services.iamSamlProvider)
  if (iamSamlProviders?.data?.[region]) {
    const dataInRegion = iamSamlProviders.data[region].filter(provider =>
      SamlProviderARNs.includes(provider.arn)
    )

    if (!isEmpty(dataInRegion)) {
      for (const provider of dataInRegion) {
        connections.push({
          id: provider.KeyId,
          resourceType: services.iamSamlProvider,
          relation: 'child',
          field: 'iamSamlProviders',
        })
      }
    }
  }

  /**
   * Find iamOpenIdConnectProvider
   * related to this cognito identity pool
   */
  const iamOpenIdConnectProviders = data.find(({ name }) => name === services.iamOpenIdConnectProvider)
  if (iamOpenIdConnectProviders?.data?.[region]) {
    const dataInRegion = iamOpenIdConnectProviders.data[region].filter(provider =>
      OpenIdConnectProviderARNs.includes(provider.arn)
    )

    if (!isEmpty(dataInRegion)) {
      for (const provider of dataInRegion) {
        connections.push({
          id: provider.KeyId,
          resourceType: services.iamOpenIdConnectProvider,
          relation: 'child',
          field: 'iamOpenIdConnectProviders',
        })
      }
    }
  }

  const identityPoolResult = {
    [id]: connections,
  }
  return identityPoolResult
}