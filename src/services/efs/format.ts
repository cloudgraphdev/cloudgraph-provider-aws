import { AwsEfs } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEfs } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEfs
  account: string
  region: string
}): AwsEfs => {
  const {
    FileSystemArn: arn,
    OwnerId: ownerId,
    CreationToken: creationToken,
    FileSystemId: fileSystemId,
    CreationTime: creationTime,
    LifeCycleState: lifeCycleState,
    Name: name,
    NumberOfMountTargets: numberOfMountTargets,
    SizeInBytes: sizeInBytes,
    PerformanceMode: performanceMode,
    Encrypted: encrypted,
    ThroughputMode: throughputMode,
    ProvisionedThroughputInMibps: provisionedThroughputInMibps,
    AvailabilityZoneName: availabilityZoneName,
    AvailabilityZoneId: availabilityZoneId,
    Tags,
  } = service

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    ownerId,
    creationToken,
    fileSystemId,
    creationTime: creationTime?.toISOString(),
    lifeCycleState,
    name,
    numberOfMountTargets,
    sizeInBytes: {
      value: sizeInBytes?.Value,
      timestamp: sizeInBytes?.Timestamp?.toISOString(),
      valueInIA: sizeInBytes?.ValueInIA,
      valueInStandard: sizeInBytes?.ValueInStandard
    },
    performanceMode,
    encrypted,
    throughputMode,
    provisionedThroughputInMibps,
    availabilityZoneName,
    availabilityZoneId,
    tags: formatTagsFromMap(Tags),
  }
}
