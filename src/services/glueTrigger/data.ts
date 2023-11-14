import {
  GetTriggersCommand,
  GetTriggersRequest,
  GlueClient,
  Trigger,
} from '@aws-sdk/client-glue'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Glue Trigger'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

export interface RawAwsGlueTrigger extends Trigger {
  region: string
}

const listTriggers = async (glue: GlueClient): Promise<Trigger[]> =>
  new Promise(async resolve => {
    const triggers: Trigger[] = []

    const input: GetTriggersRequest = {
      MaxResults: MAX_ITEMS,
    }

    const listAllTriggers = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new GetTriggersCommand(input)
      glue
        .send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Triggers = [], NextToken: nextToken } = data || {}

          triggers.push(...Triggers)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllTriggers(nextToken)
          } else {
            resolve(triggers)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'glue:getTriggers',
            err,
          })
          resolve([])
        })
    }
    listAllTriggers()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsGlueTrigger[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const glueTriggerData: RawAwsGlueTrigger[] = []

    const regionPromises = regions.split(',').map(region => {
      const glue = new GlueClient({
        credentials,
        region,
      })

      return new Promise<void>(async resolveRegion => {
        const triggers = (await listTriggers(glue)) || []
        if (!isEmpty(triggers))
          glueTriggerData.push(...triggers.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(glueTriggerData, 'region'))
  })
