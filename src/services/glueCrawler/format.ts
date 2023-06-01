import { AwsGlueCrawler } from '../../types/generated'
import { glueCrawlerArn } from '../../utils/generateArns'
import { RawAwsGlueCrawler } from './data'

/**
 * Glue Crawler
 */
export default ({
  account,
  region,
  service: crawler,
}: {
  account: string
  region: string
  service: RawAwsGlueCrawler
}): AwsGlueCrawler => {
  const { Name: name } = crawler

  const arn = glueCrawlerArn({ region, account, name })

  return {
    accountId: account,
    arn,
    id: arn,
    region,
    name
  }
}
