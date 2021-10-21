import cuid from 'cuid'
import isEmpty from 'lodash/isEmpty'
import {
  AwsElasticBeanstalkEnv,
  AwsElasticBeanstalkEnvSetting,
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

import { RawAwsElasticBeanstalkEnv } from './data'

/**
 * Elastic Beanstalk
 */
export default ({
  account,
  service: env,
}: {
  account: string
  service: RawAwsElasticBeanstalkEnv
}): AwsElasticBeanstalkEnv => {
  const {
    ApplicationName: applicationName,
    CNAME: cname,
    Description: description,
    EndpointURL: endpointUrl,
    EnvironmentArn: arn,
    EnvironmentId: id,
    EnvironmentName: name,
    PlatformArn: platformArn,
    SolutionStackName: solutionStackName,
    Tier: { Name: tier } = {},
    VersionLabel: versionLabel,
    settings = [],
    Tags = {},
  } = env

  let optionSettings: AwsElasticBeanstalkEnvSetting[] = []

  if (!isEmpty(settings)) {
    optionSettings = settings
      .flatMap(({ OptionSettings }) => OptionSettings)
      .map(
        ({ Namespace: namespace, OptionName: optionName, Value: value }) => ({
          id: cuid(),
          optionName,
          value,
          namespace,
        })
      )
  }

  return {
    accountId: account,
    id,
    name,
    arn,
    tier,
    description,
    versionLabel,
    solutionStackName,
    cname,
    applicationName,
    endpointUrl,
    platformArn,
    settings: optionSettings,
    tags: formatTagsFromMap(Tags),
  }
}
