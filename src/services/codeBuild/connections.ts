import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsCodeBuild } from './data'
import services from '../../enums/services'

export default ({
  service: codebuild,
  data,
  region,
}: {
  account: string
  service: RawAwsCodeBuild
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { arn: id, encryptionKey, vpcConfig: { vpcId, securityGroupIds, subnets: codebuildSubnets } = {} } = codebuild
  const connections: ServiceConnection[] = []

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(
      kmsKey => kmsKey.Arn === encryptionKey
    )
    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        connections.push({
          id: kms.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  /**
   * Find vpc
   */
   const vpcs = data.find(({ name }) => name === services.vpc)
   if (vpcs?.data?.[region]) {
     const vpcsInRegion = vpcs.data[region].filter(
       vpc => vpc.VpcId === vpcId
     )
     if (!isEmpty(vpcsInRegion)) {
       for (const vpc of vpcsInRegion) {
         connections.push({
           id: vpc.VpcId,
           resourceType: services.vpc,
           relation: 'child',
           field: 'vpc',
         })
       }
     }
   }

   /**
   * Find securityGroups
   */
  const securityGroups = data.find(({ name }) => name === services.sg)
  if (securityGroups?.data?.[region] && !isEmpty(securityGroupIds)) {
    const sgsInRegion = securityGroups.data[region].filter(
      sg => securityGroupIds.includes(sg.GroupId)
    )
    if (!isEmpty(sgsInRegion)) {
      for (const sg of sgsInRegion) {
        connections.push({
          id: sg.GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  /**
   * Find subnets
   */
   const subnets = data.find(({ name }) => name === services.subnet)
   if (subnets?.data?.[region] && !isEmpty(codebuildSubnets)) {
     const subnetsInRegion = subnets.data[region].filter(
       subnet => codebuildSubnets.includes(subnet.SubnetId)
     )
     if (!isEmpty(subnetsInRegion)) {
       for (const subnet of subnetsInRegion) {
         connections.push({
           id: subnet.SubnetId,
           resourceType: services.subnet,
           relation: 'child',
           field: 'subnets',
         })
       }
     }
   }

  const result = {
    [id]: connections,
  }
  return result
}
