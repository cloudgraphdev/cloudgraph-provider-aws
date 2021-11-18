import { AwsEfsMountTarget } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEfsMountTarget } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEfsMountTarget
  account: string
  region: string
}): AwsEfsMountTarget => {
  const {
    MountTargetId: id,
    OwnerId: ownerId,
    FileSystemId: fileSystemId,
    LifeCycleState: lifeCycleState,
    IpAddress: ipAddress,
    AvailabilityZoneName: availabilityZoneName,
    AvailabilityZoneId: availabilityZoneId,
  } = service

  return {
    id,
    accountId: account,
    region,
    ownerId,
    fileSystemId,
    lifeCycleState,
    ipAddress,
    availabilityZoneId,
    availabilityZoneName,
  }
}
