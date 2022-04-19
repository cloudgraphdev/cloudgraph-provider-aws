import { AwsElasticBeanstalkApp } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsElasticBeanstalkApp } from './data'

/**
 * Elastic Beanstalk Application
 */
export default ({
  account,
  region,
  service: application,
}: {
  account: string
  region: string
  service: RawAwsElasticBeanstalkApp
}): AwsElasticBeanstalkApp => {
  const {
    ApplicationArn: arn,
    ApplicationName: name,
    Description: description,
    Tags = {},
    ResourceLifecycleConfig: { ServiceRole: iamServiceRole } = {},
  } = application

  return {
    accountId: account,
    id: arn,
    arn,
    name,
    description,
    region,
    iamServiceRole,
    tags: formatTagsFromMap(Tags),
  }
}
