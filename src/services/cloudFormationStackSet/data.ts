import CloudFormation, {
  StackSet,
  StackSetSummary,
} from 'aws-sdk/clients/cloudformation'
import { Config } from 'aws-sdk/lib/config'
import { groupBy, isEmpty } from 'lodash'

import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'

const serviceName = 'CloudFormationStackSet'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * Cloud Formation Stack Set
 */

export interface RawAwsCloudFormationStackSet extends Omit<StackSet, 'Tags'> {
  Tags: TagMap
  region: string
}

const listStackSets = async (
  cf: CloudFormation
): Promise<StackSetSummary[]> => {
  try {
    const fullStackSets: StackSetSummary[] = []

    let stackSets = await cf.listStackSets().promise()
    fullStackSets.push(...stackSets.Summaries)
    let nextToken = stackSets.NextToken

    while (nextToken) {
      stackSets = await cf.listStackSets({ NextToken: nextToken }).promise()
      fullStackSets.push(...stackSets.Summaries)
      nextToken = stackSets.NextToken
    }

    return fullStackSets
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'CloudFormationStackSet:listStackSets',
      err,
    })
  }
  return []
}

const describeStackSet = async (
  cf: CloudFormation,
  StackSetName: string
): Promise<StackSet> => {
  try {
    const stackSetData = await cf.describeStackSet({ StackSetName }).promise()
    return stackSetData.StackSet
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'CloudFormationStackSet:describeStackSet',
      err,
    })
  }
  return null
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCloudFormationStackSet[]
}> => {
  const cfStackSetData = []

  for (const region of regions.split(',')) {
    const cf = new CloudFormation({ ...config, region, endpoint })

    const stackSets = await listStackSets(cf)

    const describeStackSetPromises = []
    for (const stackSet of stackSets) {
      describeStackSetPromises.push(describeStackSet(cf, stackSet.StackSetName))
    }
    const stackSetList = await Promise.all(describeStackSetPromises)

    if (!isEmpty(stackSetList)) {
      cfStackSetData.push(
        ...stackSetList.map((stackSet: StackSet) => ({
          ...stackSet,
          Tags: convertAwsTagsToTagMap(stackSet.Tags),
          region,
        }))
      )
    }
  }
  errorLog.reset()

  return groupBy(cfStackSetData, 'region')
}
