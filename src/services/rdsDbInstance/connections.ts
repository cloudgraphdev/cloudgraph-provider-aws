import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { DBInstance } from 'aws-sdk/clients/rds'
import { RawAwsSubnet } from '../subnet/data'
import services from '../../enums/services'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'
import { AwsKms } from '../kms/data'
import { RawAwsLogGroup } from '../cloudwatchLogs/data'
import { RawAwsRoute53HostedZone } from '../route53HostedZone/data'
import { getHostedZoneId } from '../../utils/ids'

export default ({
  service,
  data,
  region,
}: {
  service: DBInstance
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const {
    DBInstanceArn: id,
    VpcSecurityGroups,
    DBSubnetGroup,
    MonitoringRoleArn: monitoringRoleArn,
    AssociatedRoles: associatedRoles = [],
    PerformanceInsightsKMSKeyId,
    KmsKeyId,
    ActivityStreamKmsKeyId,
    DomainMemberships,
    EnhancedMonitoringResourceArn,
    Endpoint,
  } = service

  const sgIds = VpcSecurityGroups.map(
    ({ VpcSecurityGroupId }) => VpcSecurityGroupId
  )
  const subnetIds = (DBSubnetGroup?.Subnets || []).map(
    ({ SubnetIdentifier }) => SubnetIdentifier
  )

  /**
   * Find Security Groups VPC Security Groups
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
   * Find Subnets
   */
  const subnets = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion = subnets.data[region].filter(
      (subnet: RawAwsSubnet) => subnetIds.includes(subnet.SubnetId)
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId } = subnet

        connections.push({
          id: SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
      }
    }
  }

  /**
   * Find Cloudwatch Logs
   */
  const cloudwatchLogs = data.find(
    ({ name }) => name === services.cloudwatchLog
  )
  if (cloudwatchLogs?.data?.[region]) {
    // Search the correspondent cloudwatch log group name for the rds logs
    // e.g. enhancedMonitoringArn arn:aws:logs:us-east-1::log-group:RDSOSMetrics:log-stream:db-databaseid
    // belongs to cloudwatchLogs group arn arn:aws:logs:us-east-1::log-group:RDSOSMetrics:*
    const cloudwatchLogsInRegion = cloudwatchLogs.data[region].filter(
      ({ arn }: RawAwsLogGroup) =>
        arn &&
        EnhancedMonitoringResourceArn?.includes(
          arn.substring(0, arn.length - 1)
        )
    )
    if (!isEmpty(cloudwatchLogsInRegion)) {
      for (const cloudwatchLog of cloudwatchLogsInRegion) {
        connections.push({
          id: cloudwatchLog.logGroupName,
          resourceType: services.cloudwatchLog,
          relation: 'child',
          field: 'cloudwatchLogs',
        })
      }
    }
  }

  /**
   * Find Route53 Hosted Zone
   */
  const route53HostedZones = data.find(
    ({ name }) => name === services.route53HostedZone
  )
  if (route53HostedZones?.data?.[globalRegionName]) {
    const route53HostedZonesInRegion = route53HostedZones.data[
      globalRegionName
    ].filter(
      ({ Id }: RawAwsRoute53HostedZone) =>
        Endpoint?.HostedZoneId && Id.includes(Endpoint.HostedZoneId)
    )
    if (!isEmpty(route53HostedZonesInRegion)) {
      for (const route53HostedZone of route53HostedZonesInRegion) {
        connections.push({
          id: getHostedZoneId(route53HostedZone.Id),
          resourceType: services.route53HostedZone,
          relation: 'child',
          field: 'route53HostedZone',
        })
      }
    }
  }

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(
      ({ Arn }) =>
        Arn === KmsKeyId ||
        Arn === ActivityStreamKmsKeyId ||
        Arn === PerformanceInsightsKMSKeyId
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
      ({ Arn, RoleName }: RawAwsIamRole) =>
        Arn === monitoringRoleArn ||
        associatedRoles.find(r => r.RoleArn === Arn) ||
        DomainMemberships.find(d => d.IAMRoleName === RoleName)
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

  const rdsDbInstanceResult = {
    [id]: connections,
  }
  return rdsDbInstanceResult
}
