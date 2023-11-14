import {
  DescribeParametersCommand,
  DescribeParametersCommandInput,
  ParameterMetadata,
  SSMClient,
} from '@aws-sdk/client-ssm'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SystemsManagerParameter'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

export interface RawAwsParameterMetadata extends ParameterMetadata {
  region: string
}

const listParameters = async (ssm: SSMClient): Promise<ParameterMetadata[]> =>
  new Promise(async resolve => {
    const parameters: ParameterMetadata[] = []

    const input: DescribeParametersCommandInput = {
      MaxResults: MAX_ITEMS,
    }

    const listAllParameters = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new DescribeParametersCommand(input)
      ssm
        .send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Parameters = [], NextToken: nextToken } = data || {}

          parameters.push(...Parameters)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllParameters(nextToken)
          } else {
            resolve(parameters)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'ssm:describeParameters',
            err,
          })
          resolve([])
        })
    }
    listAllParameters()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsParameterMetadata[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const paramsData: RawAwsParameterMetadata[] = []

    const regionPromises = regions.split(',').map(async region => {
      const ssm = new SSMClient({
        credentials,
        region,
      })
      const params = (await listParameters(ssm)) || []
      if (!isEmpty(params)) {
        paramsData.push(...params.map(val => ({ ...val, region })))
      }
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(paramsData, 'region'))
  })
