import {
  AutoScalingGroup,
  TagDescriptionList,
} from 'aws-sdk/clients/autoscaling';

import { ServiceConnection } from '@cloudgraph/sdk';

import services from '../../enums/services';

/**
 * ASG
 */

export default ({
  service: asg,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: AutoScalingGroup & {
    region: string
    ec2InstanceIds: string[]
    Tags?: TagDescriptionList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    AutoScalingGroupARN: id,
    Instances: instances = [],
  } = asg


  /**
   * Find EC2 Instances
   * related to this Auto Scaling Group
   */

  const ec2Instances = data.find(({ name }) => name === services.ec2Instance)
  const ec2InstanceIds = instances.map(({ InstanceId }) => InstanceId)
  if (ec2Instances?.data?.[region]) {
    const ec2InstanceAtRegion = ec2Instances.data[region].filter(instance =>
      ec2InstanceIds.includes(instance.InstanceId)
    )

    for (const ec2instance of ec2InstanceAtRegion) {
      const ec2InstanceId = ec2instance.InstanceId

      connections.push({
        id: ec2InstanceId,
        resourceType: services.ec2Instance,
        relation: 'child',
        field: 'ec2Instance',
      })
    }
  }

  const asgResult = {
    [id]: connections,
  }
  return asgResult;
}
