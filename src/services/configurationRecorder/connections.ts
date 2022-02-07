import { ServiceConnection } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import { RawAwsConfigurationRecorder } from './data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'
import { configurationRecorderArn } from '../../utils/generateArns'

/**
 * Configuration Recorder
 */

export default ({
  service: configurationRecorder,
  data,
  account,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsConfigurationRecorder
  account: string
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const { name: configurationRecorderName, roleARN: roleArn } =
    configurationRecorder

  const id = configurationRecorderArn({
    region,
    account,
    name: configurationRecorderName,
  })

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)

  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === roleArn
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn } = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }

  return result
}
