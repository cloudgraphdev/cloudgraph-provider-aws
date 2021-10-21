import { AwsElasticBeanstalkApp } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsElasticBeanstalkApp } from './data'

/**
 * Elastic Beanstalk Application
 */
export default ({
  account,
  service: application,
}: {
  account: string
  service: RawAwsElasticBeanstalkApp
}): AwsElasticBeanstalkApp => {
  const {
    ApplicationArn: arn,
    ApplicationName: name,
    Description: description,
    Tags = {},
  } = application

  return {
    accountId: account,
    id: arn,
    arn,
    name,
    description,
    tags: formatTagsFromMap(Tags),
  }
}
