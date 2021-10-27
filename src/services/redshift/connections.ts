import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsVpc } from '../vpc/data'
import { RawAwsRedshiftCluster } from '../redshift/data'
import { redshiftArn } from '../../utils/generateArns'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsRedshiftCluster
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const { ClusterIdentifier, KmsKeyId: kmsKeyId, VpcId: vpcId } = service
  const id = redshiftArn({region, account, id: ClusterIdentifier})

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey => 
      kmsKey.Arn === kmsKeyId
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
   * Find VPCs
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)
  
  if (vpcs?.data?.[region]) {
    const vpc = vpcs.data[region].find(
      ({ VpcId }: RawAwsVpc) => VpcId === vpcId
    )

    if (vpc) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  const redshiftClusterResult = {
    [id]: connections,
  }
  return redshiftClusterResult
}
