import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsElasticBeanstalkEnv } from './data'
import { RawAwsElasticBeanstalkApp } from '../elasticBeanstalkApplication/data'
import { RawAwsAsg } from '../asg/data'
import { RawAwsEC2 } from '../ec2/data'
import { caseInsensitiveIncludes } from '../../utils/index'
import { RawAwsElb } from '../elb/data'
import { RawAwsAlb } from '../alb/data'
import { AwsSqs } from '../sqs/data'
import { elbArn } from '../../utils/generateArns'

/**
 * Elastic Beanstalk Environment
 */

export default ({
  service: environment,
  data,
  region,
  account,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsElasticBeanstalkEnv
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    EnvironmentId: id,
    ApplicationName: appName,
    resources: {
      AutoScalingGroups = [],
      Instances = [],
      LoadBalancers = [],
      Queues = [],
    },
  } = environment

  const asgNames = AutoScalingGroups.map(({ Name }) => Name)
  const ec2Ids = Instances.map(({ Id }) => Id)
  const lbNames = LoadBalancers.map(({ Name }) => Name)
  const queuesUrls = Queues.map(({ URL }) => URL)

  /**
   * Find Elastic Beanstalk environments
   * related to this Elastic Beanstalk application
   */
  const elasticBeanstalkApps: {
    name: string
    data: { [property: string]: RawAwsElasticBeanstalkApp[] }
  } = data.find(({ name }) => name === services.elasticBeanstalkApp)

  if (elasticBeanstalkApps?.data?.[region]) {
    const elasticBeanstalkAppsInRegion: RawAwsElasticBeanstalkApp[] =
      elasticBeanstalkApps.data[region].filter(
        ({ ApplicationName }) => ApplicationName === appName
      )

    if (!isEmpty(elasticBeanstalkAppsInRegion)) {
      for (const app of elasticBeanstalkAppsInRegion) {
        connections.push({
          id: app.ApplicationArn,
          resourceType: services.elasticBeanstalkApp,
          relation: 'child',
          field: 'elasticBeanstalkApp',
        })
      }
    }
  }

  /**
   * Find Auto Scaling Groups
   * related to this Elastic Beanstalk application
   */
  const asgs: {
    name: string
    data: { [property: string]: RawAwsAsg[] }
  } = data.find(({ name }) => name === services.asg)

  if (asgs?.data?.[region]) {
    const asgsInRegion: RawAwsAsg[] = asgs.data[region].filter(
      ({ AutoScalingGroupName }) =>
        caseInsensitiveIncludes(asgNames, AutoScalingGroupName)
    )

    if (!isEmpty(asgsInRegion)) {
      for (const asg of asgsInRegion) {
        connections.push({
          id: asg.AutoScalingGroupARN,
          resourceType: services.asg,
          relation: 'child',
          field: 'asgs',
        })
      }
    }
  }

  /**
   * Find EC2 Instances
   * related to this Elastic Beanstalk application
   */
  const ec2Instances: {
    name: string
    data: { [property: string]: RawAwsEC2[] }
  } = data.find(({ name }) => name === services.ec2Instance)

  if (ec2Instances?.data?.[region]) {
    const ec2InstancesInRegion: RawAwsEC2[] = ec2Instances.data[region].filter(
      ({ InstanceId }) => caseInsensitiveIncludes(ec2Ids, InstanceId)
    )

    if (!isEmpty(ec2InstancesInRegion)) {
      for (const ec2Instance of ec2InstancesInRegion) {
        connections.push({
          id: ec2Instance.InstanceId,
          resourceType: services.ec2Instance,
          relation: 'child',
          field: 'ec2Instances',
        })
      }
    }
  }

  /**
   * Find Load Balancers(ELB)
   * related to this Elastic Beanstalk application
   */
  const elbs: {
    name: string
    data: { [property: string]: RawAwsElb[] }
  } = data.find(({ name }) => name === services.elb)

  if (elbs?.data?.[region]) {
    const elbsInRegion: RawAwsElb[] = elbs.data[region].filter(
      ({ LoadBalancerName }) =>
        caseInsensitiveIncludes(lbNames, LoadBalancerName)
    )

    if (!isEmpty(elbsInRegion)) {
      for (const elb of elbsInRegion) {
        connections.push({
          id: elbArn({ region, account, name: elb.LoadBalancerName }),
          resourceType: services.elb,
          relation: 'child',
          field: 'elbs',
        })
      }
    }
  }

  /**
   * Find Load Balancers(ALB)
   * related to this Elastic Beanstalk application
   */
  const albs: {
    name: string
    data: { [property: string]: RawAwsAlb[] }
  } = data.find(({ name }) => name === services.alb)

  if (albs?.data?.[region]) {
    const albsInRegion: RawAwsAlb[] = albs.data[region].filter(
      ({ LoadBalancerName }) =>
        caseInsensitiveIncludes(lbNames, LoadBalancerName)
    )

    if (!isEmpty(albsInRegion)) {
      for (const alb of albsInRegion) {
        connections.push({
          id: alb.LoadBalancerArn,
          resourceType: services.alb,
          relation: 'child',
          field: 'albs',
        })
      }
    }
  }

  /**
   * Find Load Balancers(SQS)
   * related to this Elastic Beanstalk application
   */
  const sqs: {
    name: string
    data: { [property: string]: AwsSqs[] }
  } = data.find(({ name }) => name === services.sqs)

  if (sqs?.data?.[region]) {
    const sqsInRegion: AwsSqs[] = sqs.data[region].filter(({ queueUrl }) =>
      caseInsensitiveIncludes(queuesUrls, queueUrl)
    )

    if (!isEmpty(sqsInRegion)) {
      for (const s of sqsInRegion) {
        connections.push({
          id: s.sqsAttributes.QueueArn,
          resourceType: services.sqs,
          relation: 'child',
          field: 'sqsQueues',
        })
      }
    }
  }

  const elasticBeanstalkEnvironmentResult = {
    [id]: connections,
  }
  return elasticBeanstalkEnvironmentResult
}
