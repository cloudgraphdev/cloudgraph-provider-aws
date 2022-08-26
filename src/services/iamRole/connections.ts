import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsIamRole } from './data'
import { RawAwsIamPolicy } from '../iamPolicy/data'
import { RawAwsEcsService } from '../ecsService/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsCodeBuild } from '../codeBuild/data'
import { RawAwsGlueJob } from '../glueJob/data'
import { glueJobArn } from '../../utils/generateArns'
import { RawAwsManagedAirflow } from '../managedAirflow/data'
import { RawAwsGuardDutyDetector } from '../guardDutyDetector/data'
import { RawAwsSageMakerNotebookInstance } from '../sageMakerNotebookInstance/data'
import { RawAwsSystemsManagerInstance } from '../systemsManagerInstance/data'
import { RawAwsElasticBeanstalkApp } from '../elasticBeanstalkApplication/data'
import { RawAwsElasticBeanstalkEnv } from '../elasticBeanstalkEnvironment/data'

/**
 * IAM Role
 */

export default ({
  account,
  service: role,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsIamRole
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    Arn: id,
    ManagedPolicies: managedPolicies,
    PermissionsBoundaryArn,
  } = role

  const policies: RawAwsIamPolicy[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.iamPolicy)
        ?.data
    ) || []

  /** Find Permission Boundary Policy
   *  related to this IAM Role
   */

  const permissionBoundaryPolicy = policies.find(
    ({ Arn: arn }: RawAwsIamPolicy) => PermissionsBoundaryArn === arn
  )

  if (permissionBoundaryPolicy) {
    connections.push({
      id: PermissionsBoundaryArn,
      resourceType: services.iamPolicy,
      relation: 'child',
      field: 'iamPermissionBoundaryPolicy',
    })
  }

  /**
   * Find Managed Policies
   * related to this IAM Role
   */

  const attachedPolicies = policies.filter(({ Arn: arn }: RawAwsIamPolicy) =>
    managedPolicies.find(p => p.PolicyArn === arn)
  )

  if (!isEmpty(attachedPolicies)) {
    for (const instance of attachedPolicies) {
      const { Arn: policyId } = instance

      connections.push({
        id: policyId,
        resourceType: services.iamPolicy,
        relation: 'child',
        field: 'iamAttachedPolicies',
      })
    }
  }

  /**
   * Find related ECS service
   */
  const ecsServices: {
    name: string
    data: { [property: string]: RawAwsEcsService[] }
  } = data.find(({ name }) => name === services.ecsService)
  if (ecsServices?.data?.[region]) {
    const ecsServicesInRegion: RawAwsEcsService[] = ecsServices.data[
      region
    ].filter(({ roleArn }: RawAwsEcsService) => roleArn === role.Arn)
    if (!isEmpty(ecsServicesInRegion)) {
      for (const service of ecsServicesInRegion) {
        const { serviceArn } = service

        connections.push({
          id: serviceArn,
          resourceType: services.ecsService,
          relation: 'child',
          field: 'ecsServices',
        })
      }
    }
  }

  /**
   * Find any FlowLog related data
   */
  const flowLogs = data.find(({ name }) => name === services.flowLog)
  if (flowLogs?.data?.[region]) {
    const dataAtRegion: RawFlowLog[] = flowLogs.data[region].filter(
      ({ DeliverLogsPermissionArn }: RawFlowLog) =>
        DeliverLogsPermissionArn === role.Arn
    )
    for (const flowLog of dataAtRegion) {
      connections.push({
        id: flowLog.FlowLogId,
        resourceType: services.flowLog,
        relation: 'child',
        field: 'flowLogs',
      })
    }
  }

  /**
   * Find any CodeBuild related data
   */
  const codebuild = data.find(({ name }) => name === services.codebuild)
  if (codebuild?.data?.[region]) {
    const dataAtRegion: RawAwsCodeBuild[] = codebuild.data[region].filter(
      ({ serviceRole, resourceAccessRole }: RawAwsCodeBuild) =>
        serviceRole === role.Arn || resourceAccessRole === role.Arn
    )
    for (const cb of dataAtRegion) {
      connections.push({
        id: cb.arn,
        resourceType: services.codebuild,
        relation: 'child',
        field: 'codebuilds',
      })
    }
  }

  /**
   * Find any glueJob related data
   */
  const jobs = data.find(({ name }) => name === services.glueJob)
  if (jobs?.data?.[region]) {
    const dataAtRegion: RawAwsGlueJob[] = jobs.data[region].filter(
      ({ Role }: RawAwsGlueJob) => Role === role.Arn
    )
    for (const job of dataAtRegion) {
      const arn = glueJobArn({ region, account, name: job.Name })
      connections.push({
        id: arn,
        resourceType: services.glueJob,
        relation: 'child',
        field: 'glueJobs',
      })
    }
  }

  /**
   * Find any managedAirflow related data
   */
  const managedAirflow = data.find(
    ({ name }) => name === services.managedAirflow
  )
  if (managedAirflow?.data?.[region]) {
    const dataAtRegion: RawAwsManagedAirflow[] = managedAirflow.data[
      region
    ].filter(
      ({ ServiceRoleArn, ExecutionRoleArn }: RawAwsManagedAirflow) =>
        ServiceRoleArn === role.Arn || ExecutionRoleArn === role.Arn
    )
    for (const airflow of dataAtRegion) {
      connections.push({
        id: airflow.Arn,
        resourceType: services.managedAirflow,
        relation: 'child',
        field: 'managedAirflows',
      })
    }
  }

  /**
   * Find any guardDutyDetector related data
   */
  const detectors = data.find(({ name }) => name === services.guardDutyDetector)
  if (detectors?.data?.[region]) {
    const dataAtRegion: RawAwsGuardDutyDetector[] = detectors.data[
      region
    ].filter(
      ({ ServiceRole }: RawAwsGuardDutyDetector) => ServiceRole === role.Arn
    )
    for (const detector of dataAtRegion) {
      connections.push({
        id: detector.id,
        resourceType: services.guardDutyDetector,
        relation: 'child',
        field: 'guardDutyDetectors',
      })
    }
  }
  /**
   * Find any systemsManagerInstance related data
   */
  const systemsManagerInstances = data.find(
    ({ name }) => name === services.systemsManagerInstance
  )
  if (systemsManagerInstances?.data?.[region]) {
    const dataAtRegion: RawAwsSystemsManagerInstance[] =
      systemsManagerInstances.data[region].filter(
        ({ IamRole }: RawAwsSystemsManagerInstance) => IamRole === role.Arn
      )
    for (const instance of dataAtRegion) {
      connections.push({
        id: instance.InstanceId,
        resourceType: services.systemsManagerInstance,
        relation: 'child',
        field: 'systemManagerInstances',
      })
    }
  }

  /**
   * Find any sageMakerNotebookInstance related data
   */
  const notebooks = data.find(
    ({ name }) => name === services.sageMakerNotebookInstance
  )
  if (notebooks?.data?.[region]) {
    const dataAtRegion: RawAwsSageMakerNotebookInstance[] = notebooks.data[
      region
    ].filter(
      ({ RoleArn }: RawAwsSageMakerNotebookInstance) => RoleArn === role.Arn
    )
    for (const notebook of dataAtRegion) {
      connections.push({
        id: notebook.NotebookInstanceArn,
        resourceType: services.sageMakerNotebookInstance,
        relation: 'child',
        field: 'sageMakerNotebookInstances',
      })
    }
  }

  /**
   * Find any elasticBeanstalkApp related data
   */
  const elasticBApps = data.find(
    ({ name }) => name === services.elasticBeanstalkApp
  )
  if (elasticBApps?.data?.[region]) {
    const dataAtRegion: RawAwsElasticBeanstalkApp[] = elasticBApps.data[
      region
    ].filter(
      ({
        ResourceLifecycleConfig: { ServiceRole: iamServiceRole } = {},
      }: RawAwsElasticBeanstalkApp) => iamServiceRole === role.Arn
    )
    for (const elasticBApp of dataAtRegion) {
      connections.push({
        id: elasticBApp.ApplicationArn,
        resourceType: services.elasticBeanstalkApp,
        relation: 'child',
        field: 'elasticBeanstalkApps',
      })
    }
  }

  /**
   * Find any elasticBeanstalkEnv related data
   */
  const elasticBEnvs = data.find(
    ({ name }) => name === services.elasticBeanstalkEnv
  )
  if (elasticBEnvs?.data?.[region]) {
    const dataAtRegion: RawAwsElasticBeanstalkEnv[] = elasticBEnvs.data[
      region
    ].filter(
      ({ OperationsRole }: RawAwsElasticBeanstalkEnv) =>
        OperationsRole === role.Arn
    )
    for (const elasticBEnv of dataAtRegion) {
      connections.push({
        id: elasticBEnv.EnvironmentId,
        resourceType: services.elasticBeanstalkEnv,
        relation: 'child',
        field: 'elasticBeanstalkEnvs',
      })
    }
  }

  return {
    [id]: connections,
  }
}
