import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { RawAwsDynamoDbTable } from './data'
import { AwsKms } from '../kms/data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * Dynamo DB
 */

export default ({
  service: dynamoDbTable,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsDynamoDbTable
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    TableId: id,
    SSEDescription: sseDescription,
    Replicas: replicas,
  } = dynamoDbTable

  /**
   * Find KMS
   * related to this dynamo db table
   */
  const kmsMasterKeyArn = sseDescription?.KMSMasterKeyArn
  const kms = data.find(({ name }) => name === services.kms)

  if (kmsMasterKeyArn && kms?.data?.[region]) {
    const kmsInRegion: AwsKms = kms.data[region].find(
      ({ Arn }: AwsKms) => kmsMasterKeyArn === Arn
    )

    if (kmsInRegion) {
      connections.push({
        id: kmsInRegion.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  /**
   * Find IAM Roles
   * related to this dynamo db table
   */
  const roleArns: string[] = []
  replicas?.map(({ AutoScaling: autoScaling }) => {
    roleArns.push(
      autoScaling?.ReplicaProvisionedReadCapacityAutoScalingSettings
        ?.AutoScalingRoleArn
    )
    roleArns.push(
      autoScaling?.ReplicaProvisionedWriteCapacityAutoScalingSettings
        ?.AutoScalingRoleArn
    )
  })

  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      ({ Arn }: RawAwsIamRole) => roleArns?.includes(Arn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const iamRole of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = iamRole

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  const dynamoDbResult = {
    [id]: connections,
  }
  return dynamoDbResult
}
