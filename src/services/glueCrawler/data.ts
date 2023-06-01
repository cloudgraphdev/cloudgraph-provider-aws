import {
  Crawler,
  GetCrawlersCommand,
  GetCrawlersRequest,
  GlueClient
} from '@aws-sdk/client-glue'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Glue Crawler'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

export interface RawAwsGlueCrawler extends Crawler {
  region: string
}

const listCrawlers = async (glue: GlueClient): Promise<Crawler[]> =>
  new Promise(async resolve => {
    const crawlers: Crawler[] = []

    const input: GetCrawlersRequest = {
      MaxResults: MAX_ITEMS,
    }

    const listAllCrawlers = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new GetCrawlersCommand(input)
      glue
        .send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Crawlers = [], NextToken: nextToken } = data || {}

          crawlers.push(...Crawlers)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllCrawlers(nextToken)
          } else {
            resolve(crawlers)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'glue:getCrawlers',
            err,
          })
          resolve([])
        })
    }
    listAllCrawlers()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsGlueCrawler[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const glueCrawlerData: RawAwsGlueCrawler[] = []

    const regionPromises = regions.split(',').map(region => {
      const glue = new GlueClient({
        credentials,
        region,
      })

      return new Promise<void>(async resolveRegion => {
        const crawlers = (await listCrawlers(glue)) || []
        if (!isEmpty(crawlers))
          glueCrawlerData.push(...crawlers.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(glueCrawlerData, 'region'))
  })
