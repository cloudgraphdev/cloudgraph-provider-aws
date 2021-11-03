import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEmrInstance } from '../emrInstance/data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEmrInstance
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { Id: id, Ec2InstanceId, EbsVolumes } = service
  const connections: ServiceConnection[] = []

  /**
   * Find EC2 Instances
   */
  const ec2Instances = data.find(({ name }) => name === services.ec2Instance)
  if (ec2Instances?.data?.[region]) {
    const ec2InstanceInRegion = ec2Instances.data[region].filter(({ InstanceId }) => 
      InstanceId === Ec2InstanceId
    )

    if (!isEmpty(ec2InstanceInRegion)) {
      for (const ec2instance of ec2InstanceInRegion) {
        const ec2InstanceId = ec2instance.InstanceId

        connections.push({
          id: ec2InstanceId,
          resourceType: services.ec2Instance,
          relation: 'child',
          field: 'ec2Instance',
        })
      }
    }
  }

  /**
   * Find EBS volumes
   */
  const ebsVolumes = data.find(({ name }) => name === services.ebs)
  const ebsVolumeIds = EbsVolumes.map(({ VolumeId }) => VolumeId)
  if (ebsVolumes?.data?.[region]) {
    const volumesInRegion = ebsVolumes.data[region].filter(
      ({ VolumeId }) => ebsVolumeIds.includes(VolumeId)
    )

    if (!isEmpty(volumesInRegion)) {
      for (const v of volumesInRegion) {
        connections.push({
          id: v.VolumeId,
          resourceType: services.ebs,
          relation: 'child',
          field: 'ebs',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }

  return result
}
  