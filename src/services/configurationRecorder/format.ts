import { RawAwsConfigurationRecorder } from './data'
import { AwsConfigurationRecorder } from '../../types/generated'
import { configurationRecorderArn } from '../../utils/generateArns'

/**
 * Configuration Recorder
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsConfigurationRecorder
  account: string
  region: string
}): AwsConfigurationRecorder => {
  const { 
    name, 
    roleARN, 
    recordingGroup,
    Status: status 
  } = rawData

  const arn = configurationRecorderArn({ region, account, name })
  return {
    id: arn,
    accountId: account,
    arn,
    region,
    name,
    roleARN,
    recordingGroup,
    status: {
      name: status?.name || '',
      lastStatus: status?.lastStatus || '',
      recording: status?.recording,
      lastStatusChangeTime: status?.lastStatusChangeTime?.toISOString() || '',
      lastStartTime: status?.lastStartTime?.toISOString() || '',
      lastStopTime: status?.lastStopTime?.toISOString() || '',
    }
  }
}
