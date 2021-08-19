import { ServiceConnection } from '@cloudgraph/sdk'
import { MetricAlarm } from 'aws-sdk/clients/cloudwatch'
import { Vpc } from 'aws-sdk/clients/ec2'
import { isEmpty } from 'lodash'
import services from '../../enums/services'
import regions from '../../enums/regions'

const findServiceInstancesWithTag = (tag, service) => {
  const { id } = tag
  return service.filter(({ Tags }) => {
    for (const [key, value] of Object.entries(Tags)) {
      if (id === `${key}:${value}`) {
        return true
      }
    }
    return false
  })
}

export default ({
  service: tag,
  data,
}: {
  service: any
  data: Array<{ name: string; data: { [property: string]: any[] } }>
}): {
  [property: string]: ServiceConnection[]
} => {
  // console.log(`Searching for connections for tag ${JSON.stringify(tag)}`)
  const connections: ServiceConnection[] = []
  for (const region of regions) {
    /**
     * Find related ALBs
     */
    const albs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.alb)
    if (albs?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        albs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const alb of dataAtRegion) {
          const { LoadBalancerArn: id } = alb
          connections.push({
            id,
            resourceType: services.alb,
            relation: 'child',
            field: 'alb',
          })
        }
      }
    }

    /**
     * Find related Cloudwatch
     */
    const cws: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cloudwatch)
    if (cws?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        cws.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const cw of dataAtRegion) {
          const { AlarmArn: id }: MetricAlarm = cw
          connections.push({
            id,
            resourceType: services.cloudwatch,
            relation: 'child',
            field: 'cloudwatch',
          })
        }
      }
    }

    /**
     * Find related KMS keys
     */
    const kmsKeys: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.kms)
    if (kmsKeys?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        kmsKeys.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const key of dataAtRegion) {
          const { KeyId: id } = key
          connections.push({
            id,
            resourceType: services.kms,
            relation: 'child',
            field: 'kms',
          })
        }
      }
    }

    /**
     * Find related ec2 instances
     */
    const ec2s: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ec2Instance)
    if (ec2s?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, ec2s.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { InstanceId: id } = instance

          connections.push({
            id,
            resourceType: services.ec2Instance,
            relation: 'child',
            field: 'ec2Instance',
          })
        }
      }
    }

    /**
     * Find related lambdas
     */
    const lambdas: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.lambda)
    if (lambdas?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        lambdas.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { functionArn: id } = instance

          connections.push({
            id,
            resourceType: services.lambda,
            relation: 'child',
            field: 'lambda',
          })
        }
      }
    }

    /**
     * Find related SecurityGroups
     */
    const securityGroups: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.sg)
    if (securityGroups?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        securityGroups.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { GroupId: id } = instance

          connections.push({
            id,
            resourceType: services.sg,
            relation: 'child',
            field: 'securityGroups',
          })
        }
      }
    }

    /**
     * Find related EIP
     */
    const eips: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.eip)
    if (eips?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, eips.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { AllocationId: id } = instance

          connections.push({
            id,
            resourceType: services.eip,
            relation: 'child',
            field: 'eip',
          })
        }
      }
    }

    /**
     * Find related EBS
     */
    const ebs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ebs)
    if (ebs?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, ebs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VolumeId: id } = instance

          connections.push({
            id,
            resourceType: services.ebs,
            relation: 'child',
            field: 'ebs',
          })
        }
      }
    }

    /**
     * Find related IGW
     */
    const igws: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.igw)
    if (igws?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, igws.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { InternetGatewayId: id } = instance

          connections.push({
            id,
            resourceType: services.igw,
            relation: 'child',
            field: 'igw',
          })
        }
      }
    }

    /**
     * Find related Network Interface
     */
    const networkInterfaces: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.networkInterface)
    if (networkInterfaces?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        networkInterfaces.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { NetworkInterfaceId: id } = instance

          connections.push({
            id,
            resourceType: services.networkInterface,
            relation: 'child',
            field: 'networkInterface',
          })
        }
      }
    }

    /**
     * Find related VPCs
     */
    const vpcs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.vpc)
    if (vpcs?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, vpcs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VpcId: id }: Vpc = instance

          connections.push({
            id,
            resourceType: services.vpc,
            relation: 'child',
            field: 'vpc',
          })
        }
      }
    }
    /**

     * Find related ELB
     */
    const elbs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.elb)
    if (elbs?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, elbs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { LoadBalancerName: id } = instance

          connections.push({
            id,
            resourceType: services.elb,
            relation: 'child',
            field: 'elb',
          })
        }
      }
    }
  }

  const tagResult = {
    [tag.id]: connections,
  }
  return tagResult
}
