import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import AccessAnalyzer, {
  ListAnalyzersRequest,
  ListAnalyzersResponse,
  AnalyzerSummary,
  AnalyzersList,
} from 'aws-sdk/clients/accessanalyzer'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { TagMap } from '../../types'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Access Analyzer'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listAnalyzersData = async ({
  accessAnalyzer,
  region,
  nextToken: NextToken = '',
}: {
  accessAnalyzer: AccessAnalyzer
  region: string
  nextToken?: string
}): Promise<(AnalyzerSummary & { region: string })[]> =>
  new Promise<(AnalyzerSummary & { region: string })[]>(resolve => {
    let analyzerSummarytData: (AnalyzerSummary & {
      region: string
    })[] = []

    const analyzersList: AnalyzersList = []
    let args: ListAnalyzersRequest = {}

    if (NextToken) {
      args = { ...args, nextToken: NextToken }
    }

    accessAnalyzer.listAnalyzers(
      args,
      (err: AWSError, data: ListAnalyzersResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'accessAnalyzer:listAnalyzers',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { nextToken, analyzers: analyzersData = [] } = data

          analyzersList.push(...analyzersData)

          logger.debug(lt.fetchedaccessAnalyzers(analyzersList.length))

          if (nextToken) {
            listAnalyzersData({ accessAnalyzer, region, nextToken })
          }

          analyzerSummarytData = analyzersList.map(analyzer => ({
            ...analyzer,
            region,
          }))
        }

        resolve(analyzerSummarytData)
      }
    )
  })

/**
 * IAM Access Analyzer
 */

export interface RawAwsAnalyzerSummary extends Omit<AnalyzerSummary, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsAnalyzerSummary[]
}> =>
  new Promise(async resolve => {
    const analyzerSummaryResult: RawAwsAnalyzerSummary[] = []

    const regionPromises = regions.split(',').map(region => {
      const accessAnalyzer = new AccessAnalyzer({ ...config, region, endpoint })

      return new Promise<void>(async resolveAnalyzerSummaryData => {
        const analyzerSummaryData = await listAnalyzersData({
          accessAnalyzer,
          region,
        })

        if (!isEmpty(analyzerSummaryData)) {
          for (const analyzer of analyzerSummaryData) {
            analyzerSummaryResult.push({
              ...analyzer,
              region,
              Tags: analyzer.tags || {}
            })
          }
        }

        resolveAnalyzerSummaryData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(analyzerSummaryResult, 'region'))
  })
