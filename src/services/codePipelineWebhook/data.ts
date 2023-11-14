import {
  CodePipelineClient,
  ListWebhookItem,
  ListWebhooksCommand,
  ListWebhooksInput,
} from '@aws-sdk/client-codepipeline'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Code Pipeline Webhook'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

export interface RawAwsWebhook extends ListWebhookItem {
  region: string
}

const listWebhooks = async (
  cp: CodePipelineClient
): Promise<ListWebhookItem[]> =>
  new Promise(async resolve => {
    const webhookDefinitions: ListWebhookItem[] = []

    const input: ListWebhooksInput = {
      MaxResults: MAX_ITEMS,
    }

    const listAllWebhooks = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new ListWebhooksCommand(input)
      cp.send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { webhooks = [], NextToken } = data || {}

          webhookDefinitions.push(...webhooks)

          if (NextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllWebhooks(NextToken)
          } else {
            resolve(webhookDefinitions)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'codepipeline:listWebhooks',
            err,
          })
          resolve([])
        })
    }
    listAllWebhooks()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsWebhook[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const webhooksData: RawAwsWebhook[] = []

    const regionPromises = regions.split(',').map(region => {
      const cpClient = new CodePipelineClient({
        credentials,
        region,
      })
      return new Promise<void>(async resolveRegion => {
        const webhooks = (await listWebhooks(cpClient)) || []
        if (!isEmpty(webhooks))
          webhooksData.push(...webhooks.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(webhooksData, 'region'))
  })
