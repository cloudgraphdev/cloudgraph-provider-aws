import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { AwsKms } from '../kms/data'
import { RawAwsDmsReplicationInstance } from '../dmsReplicationInstance/data'
import { AwsSecurityGroup } from '../securityGroup/data'

export default ({
  service: replication,
  data,
  region,
}: {
  service: RawAwsDmsReplicationInstance
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { ReplicationInstanceArn, KmsKeyId, VpcSecurityGroups = [] } = replication
  const connections: ServiceConnection[] = []
  const sgIds = VpcSecurityGroups.map(({ VpcSecurityGroupId }) => VpcSecurityGroupId)
  /**
   * Find any kms related data
   */
  const keys = data.find(({ name }) => name === services.kms)
  if (keys?.data?.[region]) {
    const dataAtRegion: AwsKms[] = keys.data[region].filter(
      ({
        Arn
      }: AwsKms) => Arn === KmsKeyId
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

  /**
   * Find any securityGroups related data
   */
   const securityGroups = data.find(({ name }) => name === services.sg)
   if (securityGroups?.data?.[region]) {
     const dataAtRegion: AwsSecurityGroup[] = securityGroups.data[region].filter(
       ({
        GroupId
       }: AwsSecurityGroup) => sgIds.includes(GroupId)
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

  const natResult = {
    [ReplicationInstanceArn]: connections,
  }
  return natResult
}
