// import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsManagedAirflow } from '../../types/generated'
import { RawAwsManagedAirflow } from './data'
import { formatTagsFromMap } from '../../utils/format'

/**
 * ManagedAirflow
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsManagedAirflow
  region: string
}): AwsManagedAirflow => {
  const {
    AirflowConfigurationOptions = {},
    AirflowVersion: airflowVersion,
    Arn: arn,
    CreatedAt: createdAt,
    DagS3Path: dagS3Path,
    KmsKey,
    EnvironmentClass: environmentClass,
    ExecutionRoleArn: executionRoleArn,
    LastUpdate: {
      CreatedAt: lastUpdateCreatedAt,
      Error: { ErrorCode: errorCode, ErrorMessage: errorMessage } = {},
      Status: lastUpdateStatus,
    } = {},
    LoggingConfiguration: {
      DagProcessingLogs: {
        CloudWatchLogGroupArn: cloudWatchLogGroupArn,
        Enabled: enabled,
        LogLevel: logLevel,
      } = {},
      SchedulerLogs: {
        CloudWatchLogGroupArn: schedulerCloudWatchLogGroupArn,
        Enabled: schedulerLogsEnabled,
        LogLevel: schedulerLogLevel,
      } = {},
      TaskLogs: {
        CloudWatchLogGroupArn: taskCloudWatchLogGroupArn,
        Enabled: taskEnabled,
        LogLevel: taskLogLevel,
      } = {},
      WebserverLogs: {
        CloudWatchLogGroupArn: webserverCloudWatchLogGroupArn,
        Enabled: webserverEnabled,
        LogLevel: webserverLogLevel,
      } = {},
      WorkerLogs: {
        CloudWatchLogGroupArn: workerCloudWatchLogGroupArn,
        Enabled: workerEnabled,
        LogLevel: workerLogLevel,
      } = {},
    } = {},
    MaxWorkers: maxWorkers,
    MinWorkers: minWorkers,
    Name: name,
    NetworkConfiguration: {
      SecurityGroupIds: securityGroupIds,
      SubnetIds: subnetIds,
    } = {},
    PluginsS3Path: pluginsS3Path,
    RequirementsS3Path: requirementsS3Path,
    Schedulers: schedulers,
    ServiceRoleArn: serviceRoleArn,
    SourceBucketArn: sourceBucketArn,
    Status: status,
    Tags = {},
    WebserverAccessMode: webserverAccessMode,
    WebserverUrl: webserverUrl,
    WeeklyMaintenanceWindowStart: weeklyMaintenanceWindowStart,
  } = rawData

  const mappedAirflowConfigurationOptions = Object.keys(
    AirflowConfigurationOptions
  ).map(key => ({
    id: generateUniqueId({
      arn,
      key,
      value: AirflowConfigurationOptions[key],
    }),
    key,
    value: AirflowConfigurationOptions[key],
  }))

  return {
    id: arn,
    arn,
    region,
    accountId: account,
    airflowConfigurationOptions: mappedAirflowConfigurationOptions,
    airflowVersion,
    kmsKey: KmsKey,
    createdAt: createdAt?.toISOString(),
    dagS3Path,
    environmentClass,
    executionRoleArn,
    lastUpdate: {
      createdAt: lastUpdateCreatedAt?.toISOString(),
      status: lastUpdateStatus,
      error: {
        errorCode,
        errorMessage,
      },
    },
    loggingConfiguration: {
      dagProcessingLogs: {
        cloudWatchLogGroupArn,
        enabled,
        logLevel,
      },
      schedulerLogs: {
        cloudWatchLogGroupArn: schedulerCloudWatchLogGroupArn,
        enabled: schedulerLogsEnabled,
        logLevel: schedulerLogLevel,
      },
      taskLogs: {
        cloudWatchLogGroupArn: taskCloudWatchLogGroupArn,
        enabled: taskEnabled,
        logLevel: taskLogLevel,
      },
      webserverLogs: {
        cloudWatchLogGroupArn: webserverCloudWatchLogGroupArn,
        enabled: webserverEnabled,
        logLevel: webserverLogLevel,
      },
      workerLogs: {
        cloudWatchLogGroupArn: workerCloudWatchLogGroupArn,
        enabled: workerEnabled,
        logLevel: workerLogLevel,
      },
    },
    networkConfiguration: {
      subnetIds,
      securityGroupIds,
    },
    maxWorkers,
    minWorkers,
    name,
    pluginsS3Path,
    requirementsS3Path,
    schedulers,
    serviceRoleArn,
    sourceBucketArn,
    status,
    tags: formatTagsFromMap(Tags),
    webserverAccessMode,
    webserverUrl,
    weeklyMaintenanceWindowStart,
  }
}
