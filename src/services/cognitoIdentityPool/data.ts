import COGID, { IdentityPool, IdentityPoolShortDescription } from 'aws-sdk/clients/cognitoidentity'

import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import { Credentials, TagMap } from '../../types'
import { generateAwsErrorLog } from '../../utils'
import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph

/**
 * Cognito Identity Pool
 */

const MAX_RESULTS = 60
const serviceName = 'cognitoIdentityPool'

export interface RawAwsCognitoIdentityPool extends Omit<IdentityPool, 'IdentityPoolTags'> {
  region: string
  Tags: TagMap
}

const listIdentityPoolIds = async (cogId: COGID): Promise<IdentityPoolShortDescription[]> => {
  try {
    const fullResources: IdentityPoolShortDescription[] = []
  
    let identityPools = await cogId.listIdentityPools({
      MaxResults: MAX_RESULTS,
    }).promise()
    fullResources.push(...identityPools.IdentityPools)
    let nextToken = identityPools.NextToken

    while (nextToken) {
      identityPools = await cogId.listIdentityPools({
        MaxResults: MAX_RESULTS,
        NextToken: nextToken,
      }).promise()
      fullResources.push(...identityPools.IdentityPools)
      nextToken = identityPools.NextToken
    }
    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoIdentityPool:listIdentityPoolIds', err)
  }
  return []
}

const describeIdentityPool = async ({
  cogId, 
  IdentityPoolId, 
}: {
  cogId: COGID, 
  IdentityPoolId: string, 
}): Promise<Omit<IdentityPool, 'IdentityPoolTags'> & {Tags: TagMap}> => {
  try {
    const identityPool = await cogId.describeIdentityPool({IdentityPoolId}).promise()
    logger.debug(lt.fetchedCognitoIdentityPool(IdentityPoolId))
    const Tags = identityPool.IdentityPoolTags || {}
    delete identityPool.IdentityPoolTags
    const pool = {
      ...identityPool,
      Tags
    }
    return pool
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoIdentityPool:describeIdentityPool', err)
  }
  return null
}

const listIdentityPoolData = async ({
  cogId,
  region,
}: {
  cogId: COGID,
  region: string,
}): Promise<RawAwsCognitoIdentityPool[]> => {
  const identityPoolData = []
  const identityPoolIds = await listIdentityPoolIds(cogId)

  for (const identityPoolId of identityPoolIds) {
    const identityPool = await describeIdentityPool({cogId, IdentityPoolId: identityPoolId.IdentityPoolId})
    identityPoolData.push({
      ...identityPool,
      region,
    })
  }

  logger.debug(lt.fetchedCognitoIdentityPools(identityPoolIds.length))
  
  return identityPoolData
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsCognitoIdentityPool[]
}> => {
  const cognitoData = []
  
  for (const region of regions.split(',')) {
    const cogId = new COGID({ region, credentials })

    /**
     * Fetch all Identity Pools
     */

    const identityPoolData = await listIdentityPoolData({cogId, region})
    cognitoData.push(...identityPoolData)
  }

  logger.debug(lt.addingIdentityPools(cognitoData.length))

  return groupBy(cognitoData, 'region')
}
