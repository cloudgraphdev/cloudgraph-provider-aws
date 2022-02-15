import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsManagedAirflow } from '../managedAirflow/data'
import { RawAwsS3 } from '../s3/data'
import { AwsSecurityGroup } from '../securityGroup/data'
import { s3BucketArn } from '../../utils/generateArns'

export default ({
  service: airflow,
  data,
  region,
}: {
  service: RawAwsManagedAirflow
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { Arn, SourceBucketArn, NetworkConfiguration: { SecurityGroupIds = [] } = {} } = airflow
  const connections: ServiceConnection[] = []

  /**
   * Find any S3 related data
   */
   const buckets = data.find(({ name }) => name === services.s3)
   if (buckets?.data?.[region]) {
     const dataAtRegion: RawAwsS3[] = buckets.data[region].filter(
       ({ Name: name }: RawAwsS3) =>
         s3BucketArn({ name }) === SourceBucketArn
     )
     for (const bucket of dataAtRegion) {
       connections.push({
         id: bucket.Id,
         resourceType: services.s3,
         relation: 'child',
         field: 's3',
       })
     }
   }

   /**
   * Find any securityGroups related data
   */
    const securityGroups = data.find(({ name }) => name === services.sg)
    if (securityGroups?.data?.[region]) {
      const dataAtRegion: AwsSecurityGroup[] = securityGroups.data[region].filter(
        ({ GroupId  }: AwsSecurityGroup) =>
        SecurityGroupIds.includes(GroupId)
      )
      for (const securityGroup of dataAtRegion) {
        connections.push({
          id: securityGroup.GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }

  const natResult = {
    [Arn]: connections,
  }
  return natResult
}
