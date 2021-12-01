const metrics = {
  // EC2
  cpuUtilization: 'CPUUtilization',
  diskReadOps: 'DiskReadOps',
  diskWriteOps: 'DiskWriteOps',
  diskReadBytes: 'DiskReadBytes',
  diskWriteBytes: 'DiskWriteBytes',
  networkIn: 'NetworkIn',
  networkOut: 'NetworkOut',
  networkPacketsIn: 'NetworkPacketsIn',
  networkPacketsOut: 'NetworkPacketsOut',
  statusCheckFailed: 'StatusCheckFailed',
  statusCheckFailedInstance: 'StatusCheckFailed_Instance',
  statusCheckFailedSystem: 'StatusCheckFailed_System',
}


const {
  cpuUtilization,
  diskReadOps,
  diskWriteOps,
  diskReadBytes,
  diskWriteBytes,
  networkIn,
  networkOut,
  networkPacketsIn,
  networkPacketsOut,
  statusCheckFailed,
  statusCheckFailedInstance,
  statusCheckFailedSystem,
} = metrics

const average = 'Average'
const sum = 'Sum'

export const metricStats = {
  [cpuUtilization]: average,
  [diskReadOps]: average,
  [diskWriteOps]: average,
  [diskReadBytes]: average,
  [diskWriteBytes]: average,
  [networkIn]: average,
  [networkOut]: average,
  [networkPacketsIn]: average,
  [networkPacketsOut]: average,
  [statusCheckFailed]: sum,
  [statusCheckFailedInstance]: sum,
  [statusCheckFailedSystem]: sum,
}

export default [
  cpuUtilization,
  diskReadOps,
  diskWriteOps,
  diskReadBytes,
  diskWriteBytes,
  networkIn,
  networkOut,
  networkPacketsIn,
  networkPacketsOut,
  statusCheckFailed,
  statusCheckFailedInstance,
  statusCheckFailedSystem,
]
