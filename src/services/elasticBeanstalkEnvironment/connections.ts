import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsElasticBeanstalkEnv } from './data'
import { RawAwsElasticBeanstalkApp } from '../elasticBeanstalkApplication/data'

/**
 * Elastic Beanstalk Environment
 */

export default ({
  service: environment,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsElasticBeanstalkEnv
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { EnvironmentId: id, ApplicationName: appName } = environment

  /**
   * Find Elastic Beanstalk environments
   * related to this Elastic Beanstalk application
   */
  const elasticBeanstalkApps: {
    name: string
    data: { [property: string]: RawAwsElasticBeanstalkApp[] }
  } = data.find(({ name }) => name === services.elasticBeanstalkApp)

  if (elasticBeanstalkApps?.data?.[region]) {
    const elasticBeanstalkAppsInRegion: RawAwsElasticBeanstalkApp[] =
      elasticBeanstalkApps.data[region].filter(
        ({ ApplicationName }) => ApplicationName === appName
      )

    if (!isEmpty(elasticBeanstalkAppsInRegion)) {
      for (const app of elasticBeanstalkAppsInRegion) {
        connections.push({
          id: app.ApplicationArn,
          resourceType: services.elasticBeanstalkApp,
          relation: 'child',
          field: 'elasticBeanstalkApps',
        })
      }
    }
  }

  const elasticBeanstalkEnvironmentResult = {
    [id]: connections,
  }
  return elasticBeanstalkEnvironmentResult
}
