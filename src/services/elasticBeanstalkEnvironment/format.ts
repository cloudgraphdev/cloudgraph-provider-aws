import { generateUniqueId } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'
import {
  AwsElasticBeanstalkEnv,
  AwsElasticBeanstalkEnvResource,
  AwsElasticBeanstalkEnvSetting,
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

import { RawAwsElasticBeanstalkEnv } from './data'

/**
 * Elastic Beanstalk
 */
export default ({
  account,
  region,
  service: env,
}: {
  account: string
  region: string
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
    resources = [],
    settings = [],
    Tags = {},
  } = env

  let optionSettings: AwsElasticBeanstalkEnvSetting[] = []

  if (!isEmpty(settings)) {
    optionSettings = settings
      .flatMap(({ OptionSettings }) => OptionSettings)
      .map(
        ({ Namespace: namespace, OptionName: optionName, Value: value }) => ({
          id: generateUniqueId({
            arn,
            namespace,
            optionName,
            value,
          }),
          optionName,
          value,
          namespace,
        })
      )
  }

  let envResources: AwsElasticBeanstalkEnvResource[] = []

  if (!isEmpty(resources)) {
    envResources = Object.entries(resources).map(([key, item]) => ({
      id: generateUniqueId({
        arn,
        key,
        item,
      }),
      name: key,
      /* We ask for the type because resources(EnvironmentResourceDescription)
         is an object with whose property types can be string, array of strings
         or array of objects that can contain a single property named Name or Id */
      value:
        typeof item === 'string' ? [item] : item.map(i => i.Name || i.Id || i),
    }))
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
    resources: envResources,
    settings: optionSettings,
    region,
    tags: formatTagsFromMap(Tags),
  }
}
