import {
  CodePipelineClient,
  ListPipelinesCommand,
  ListPipelinesInput,
  PipelineSummary,
} from '@aws-sdk/client-codepipeline'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Code Pipeline'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 500

export interface RawAwsPipelineSummary extends PipelineSummary {
  region: string
}

const listPipelines = async (
  cp: CodePipelineClient
): Promise<PipelineSummary[]> =>
  new Promise(async resolve => {
    const codePipelines: PipelineSummary[] = []

    const input: ListPipelinesInput = {
      maxResults: MAX_ITEMS,
    }

    const listAllPipelines = (token?: string): void => {
      if (token) {
        input.nextToken = token
      }
      const command = new ListPipelinesCommand(input)
      cp.send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { pipelines = [], nextToken } = data || {}

          codePipelines.push(...pipelines)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllPipelines(nextToken)
          } else {
            resolve(codePipelines)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'codepipeline:listPipelines',
            err,
          })
          resolve([])
        })
    }
    listAllPipelines()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsPipelineSummary[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const pipelinesData: RawAwsPipelineSummary[] = []

    const regionPromises = regions.split(',').map(region => {
      const cpClient = new CodePipelineClient({
        credentials,
        region,
      })
      return new Promise<void>(async resolveRegion => {
        const pipelines = (await listPipelines(cpClient)) || []
        if (!isEmpty(pipelines))
          pipelinesData.push(...pipelines.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(pipelinesData, 'region'))
  })
