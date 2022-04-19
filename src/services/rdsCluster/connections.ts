import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { DBInstance } from 'aws-sdk/clients/rds'

import services from '../../enums/services'
import { RawAwsRdsCluster } from './data'
import { RawAwsRoute53HostedZone } from '../route53HostedZone/data'
import { RawAwsRdsClusterSnapshot } from '../rdsClusterSnapshot/data'
import { RawAwsIamRole } from '../iamRole/data'
import { RawAwsSubnet } from '../subnet/data'
import { AwsKms } from '../kms/data'
import { globalRegionName } from '../../enums/regions'

export default ({
  service,
  data,
  region,
}: {
  service: RawAwsRdsCluster
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const {
    DBClusterArn: id,
    DBClusterIdentifier: clusterId,
    dbSubnetGroups,
    MonitoringRoleArn: monitoringRoleArn,
    AssociatedRoles: associatedRoles = [],
    KmsKeyId,
    ActivityStreamKmsKeyId,
    PerformanceInsightsKMSKeyId,
    VpcSecurityGroups,
    HostedZoneId: hostedZoneId,
  } = service
  const sgIds = VpcSecurityGroups.map(
    ({ VpcSecurityGroupId }) => VpcSecurityGroupId
  )

  /**
   * Find rds db instances
   */
  const instances: {
    name: string
    data: { [property: string]: DBInstance[] }
  } = data.find(({ name }) => name === services.rdsDbInstance)

  if (instances?.data?.[region]) {
    const instancesInRegion: DBInstance[] = instances.data[region].filter(
      ({ DBClusterIdentifier }: DBInstance) => DBClusterIdentifier === clusterId
    )
    if (!isEmpty(instancesInRegion)) {
      for (const instance of instancesInRegion) {
        const { DBInstanceArn: id } = instance
        connections.push({
          id,
          resourceType: services.rdsDbInstance,
          relation: 'child',
          field: 'instances',
        })
      }
    }
  }

  /**
   * Find cluster snapshots
   */
  const snapshots: {
    name: string
    data: { [property: string]: RawAwsRdsClusterSnapshot[] }
  } = data.find(({ name }) => name === services.rdsClusterSnapshot)

  if (snapshots?.data?.[region]) {
    const dataInRegion: RawAwsRdsClusterSnapshot[] = snapshots.data[
      region
    ].filter(
      ({ DBClusterIdentifier }: RawAwsRdsClusterSnapshot) =>
        DBClusterIdentifier === clusterId
    )
    if (!isEmpty(dataInRegion)) {
      for (const snapshot of dataInRegion) {
        connections.push({
          id: snapshot.DBClusterSnapshotIdentifier,
          resourceType: services.rdsClusterSnapshot,
          relation: 'child',
          field: 'snapshots',
        })
      }
    }
  }

  /**
   * Find SecurityGroups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const sgsInRegion: SecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: SecurityGroup) => sgIds.includes(GroupId)
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
   * Find KMS
   * related to this RDS Cluster
   */
  const kms: {
    name: string
    data: { [property: string]: AwsKms[] }
  } = data.find(({ name }) => name === services.kms)

  if (kms?.data?.[region]) {
    const kmsInRegion: AwsKms[] = kms.data[region].filter(
      ({ Arn }: AwsKms) =>
        Arn === KmsKeyId ||
        Arn === ActivityStreamKmsKeyId ||
        Arn === PerformanceInsightsKMSKeyId
    )
    if (!isEmpty(kmsInRegion)) {
      for (const instance of kmsInRegion) {
        connections.push({
          id: instance.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  /**
   * Find IAM Role
   * related to this RDS Cluster
   */
  const iamRoles: {
    name: string
    data: { [property: string]: RawAwsIamRole[] }
  } = data.find(({ name }) => name === services.iamRole)

  if (iamRoles?.data?.[globalRegionName]) {
    const iamRolesInRegion: RawAwsIamRole[] = iamRoles.data[
      globalRegionName
    ].filter(
      ({ Arn }: RawAwsIamRole) =>
        Arn === monitoringRoleArn ||
        associatedRoles.find(r => r.RoleArn === Arn)
    )
    if (!isEmpty(iamRolesInRegion)) {
      for (const instance of iamRolesInRegion) {
        connections.push({
          id: instance.Arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  /**
   * Find Route53 hosted zones
   */
  const route53HostedZones: {
    name: string
    data: { [property: string]: RawAwsRoute53HostedZone[] }
  } = data.find(({ name }) => name === services.route53HostedZone)

  if (route53HostedZones?.data?.[region]) {
    const instancesInRegion: RawAwsRoute53HostedZone[] =
      route53HostedZones.data[region].filter(
        ({ Id }: RawAwsRoute53HostedZone) => Id === hostedZoneId
      )
    if (!isEmpty(instancesInRegion)) {
      for (const instance of instancesInRegion) {
        const { Id: id } = instance
        connections.push({
          id,
          resourceType: services.route53HostedZone,
          relation: 'child',
          field: 'route53HostedZone',
        })
      }
    }
  }

  /**
   * Find Subnets
   * related to this RDS Cluster
   */
  const subnets = data.find(({ name }) => name === services.subnet)
  const subnetIds = dbSubnetGroups?.map(({ Subnets }) =>
    Subnets?.map(subnet => subnet.SubnetIdentifier)
  )
  if (subnets?.data?.[region]) {
    const subnetsInRegion = subnets.data[region].filter(
      (subnet: RawAwsSubnet) =>
        subnetIds.some(ids => ids.includes(subnet.SubnetId))
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId } = subnet

        connections.push({
          id: SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnets',
        })
      }
    }
  }

  const rdsClusterResult = {
    [id]: connections,
  }
  return rdsClusterResult
}
