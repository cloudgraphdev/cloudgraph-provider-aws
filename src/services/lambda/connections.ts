/* eslint-disable no-shadow */
import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { KeyMetadata } from 'aws-sdk/clients/kms'
import { FunctionConfiguration } from 'aws-sdk/clients/lambda'
import { SecurityGroup } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'

export default ({
  service: lambda,
  data,
  region,
}: {
  service: FunctionConfiguration
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    KMSKeyArn,
    FunctionName: functionName,
    VpcConfig: { SecurityGroupIds: sgIds = [] } = { SecurityGroupIds: [] },
  } = lambda
  const connections: ServiceConnection[] = []
  /**
   * Find KmsKey used in lambda function
   */
  const kmsKeys: { name: string; data: { [property: string]: KeyMetadata[] } } =
    data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKey: KeyMetadata = kmsKeys.data[region].find(
      ({ Arn }: KeyMetadata) => Arn === KMSKeyArn
    )
    if (!isEmpty(kmsKey)) {
      const { KeyId: id } = kmsKey
      connections.push({
        id,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  /**
   * Find Security Groups VPC Security Groups
   * related to this lambda function
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
        const id = sg.GroupId
        connections.push({
          id,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  const lambdaResult = {
    [functionName]: connections,
  }
  return lambdaResult
}
