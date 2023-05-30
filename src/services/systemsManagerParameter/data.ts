import {
  DescribeParametersCommand,
  DescribeParametersCommandInput,
  ParameterMetadata,
  SSMClient,
} from '@aws-sdk/client-ssm'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SystemsManagerParameter'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

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
}): Promise<{ [property: string]: ParameterMetadata[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const output: { [property: string]: ParameterMetadata[] } = {}

    await Promise.all(
      regions.split(',').map(region => {
        const ssm = new SSMClient({
          credentials,
          region,
        })
        output[region] = []
        return new Promise<void>(async resolveRegion => {
          const params = (await listParameters(ssm)) || []
          output[region] = params
          resolveRegion()
        })
      })
    )
    errorLog.reset()

    resolve(output)
  })
