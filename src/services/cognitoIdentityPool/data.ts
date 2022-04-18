import COGID, {
  IdentityPool,
  IdentityPoolShortDescription,
  GetIdentityPoolRolesResponse,
} from 'aws-sdk/clients/cognitoidentity'
import { Config } from 'aws-sdk/lib/config'

import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'

const serviceName = 'Cognito User Pool'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const lt = { ...awsLoggerText }
const { logger } = CloudGraph

/**
 * Cognito Identity Pool
 */

const MAX_RESULTS = 60

export interface RawAwsCognitoIdentityPool
  extends Omit<IdentityPool, 'IdentityPoolTags'> {
  identityPoolRoles: GetIdentityPoolRolesResponse
  region: string
  Tags: TagMap
}

const listIdentityPoolIds = async (
  cogId: COGID
): Promise<IdentityPoolShortDescription[]> => {
  try {
    const fullResources: IdentityPoolShortDescription[] = []

    let identityPools = await cogId
      .listIdentityPools({
        MaxResults: MAX_RESULTS,
      })
      .promise()
    fullResources.push(...identityPools.IdentityPools)
    let nextToken = identityPools.NextToken

    while (nextToken) {
      identityPools = await cogId
        .listIdentityPools({
          MaxResults: MAX_RESULTS,
          NextToken: nextToken,
        })
        .promise()
      fullResources.push(...identityPools.IdentityPools)
      nextToken = identityPools.NextToken
    }
    return fullResources
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'cognitoIdentityPool:listIdentityPoolIds',
      err,
    })
  }
  return []
}

const describeIdentityPool = async ({
  cogId,
  IdentityPoolId,
}: {
  cogId: COGID
  IdentityPoolId: string
}): Promise<Omit<IdentityPool, 'IdentityPoolTags'> & { Tags: TagMap }> => {
  try {
    const identityPool = await cogId
      .describeIdentityPool({ IdentityPoolId })
      .promise()
    logger.debug(lt.fetchedCognitoIdentityPool(IdentityPoolId))
    const Tags = identityPool.IdentityPoolTags || {}
    delete identityPool.IdentityPoolTags
    const pool = {
      ...identityPool,
      Tags,
    }
    return pool
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'cognitoIdentityPool:describeIdentityPool',
      err,
    })
  }
  return null
}

const getIdentityPoolRoles = async ({
  cogId,
  IdentityPoolId,
}: {
  cogId: COGID
  IdentityPoolId: string
}): Promise<GetIdentityPoolRolesResponse> => {
  try {
    return await cogId
      .getIdentityPoolRoles({ IdentityPoolId })
      .promise()

  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'cognitoIdentityPool:getIdentityPoolRoles',
      err,
    })
  }
  return null
}

const listIdentityPoolData = async ({
  cogId,
  region,
}: {
  cogId: COGID
  region: string
}): Promise<RawAwsCognitoIdentityPool[]> => {
  const identityPoolData = []
  const identityPoolIds = await listIdentityPoolIds(cogId)

  for (const identityPoolId of identityPoolIds) {
    const identityPool = await describeIdentityPool({
      cogId,
      IdentityPoolId: identityPoolId.IdentityPoolId,
    })
    const identityPoolRoles = await getIdentityPoolRoles({
      cogId,
      IdentityPoolId: identityPoolId.IdentityPoolId,
    })
    identityPoolData.push({
      ...identityPool,
      identityPoolRoles,
      region,
    })
  }

  logger.debug(lt.fetchedCognitoIdentityPools(identityPoolIds.length))

  return identityPoolData
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCognitoIdentityPool[]
}> => {
  const cognitoData = []

  for (const region of regions.split(',')) {
    const cogId = new COGID({ ...config, region, endpoint })

    /**
     * Fetch all Identity Pools
     */

    const identityPoolData = await listIdentityPoolData({ cogId, region })
    cognitoData.push(...identityPoolData)
  }

  logger.debug(lt.addingIdentityPools(cognitoData.length))
  errorLog.reset()

  return groupBy(cognitoData, 'region')
}
