import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsElasticSearchDomain } from './data'
import { AwsSecurityGroup } from '../securityGroup/data'
import { AwsKms } from '../kms/data'

export default ({
  service: domain,
  data,
  region,
}: {
  service: RawAwsElasticSearchDomain
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    DomainId,
    VPCOptions: { SecurityGroupIds = [] } = {},
    EncryptionAtRestOptions: { KmsKeyId } = {},
  } = domain
  const connections: ServiceConnection[] = []

  /**
   * Find any securityGroup related data
   */
  const sgs = data.find(({ name }) => name === services.sg)
  if (sgs?.data?.[region]) {
    const dataAtRegion: AwsSecurityGroup[] = sgs.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) => SecurityGroupIds.includes(GroupId)
    )
    for (const sg of dataAtRegion) {
      connections.push({
        id: sg.GroupId,
        resourceType: services.sg,
        relation: 'child',
        field: 'securityGroups',
      })
    }
  }

  /**
   * Find any kms related data
   */
  const keys = data.find(({ name }) => name === services.kms)
  if (keys?.data?.[region]) {
    const dataAtRegion: AwsKms[] = keys.data[region].filter(
      ({ Arn }: AwsKms) => Arn === KmsKeyId
    )
    for (const key of dataAtRegion) {
      connections.push({
        id: key.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  const natResult = {
    [DomainId]: connections,
  }
  return natResult
}
