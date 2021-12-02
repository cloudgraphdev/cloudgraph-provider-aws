import { AwsEmrInstance } from '../../types/generated'
import { RawAwsEmrInstance } from './data'

export default ({
  service,
  account,
  region
}: {
  service: RawAwsEmrInstance
  account: string
  region
}): AwsEmrInstance => {
  const {
    Id: id,
    Ec2InstanceId: ec2InstanceId,
    PublicDnsName: publicDnsName,
    PublicIpAddress: publicIpAddress,
    PrivateDnsName: privateDnsName,
    PrivateIpAddress: privateIpAddress,
    Status: status,
    InstanceGroupId: instanceGroupId,
    InstanceFleetId: instanceFleetId,
    Market: market,
    InstanceType: instanceType,
  } = service

  const { 
    State: state ,
    StateChangeReason: stateChangeReason,
    Timeline: timeline,
  } = status ?? {}

  const {
    Code: code, Message: message
  } = stateChangeReason ?? {}

  return {
    id,
    accountId: account,
    region,
    ec2InstanceId,
    publicDnsName,
    publicIpAddress,
    privateDnsName,
    privateIpAddress,
    status: {
      state,
      stateChangeReason: {
        code,
        message,
      },
      timeline: {
        creationDateTime: timeline.CreationDateTime?.toISOString(),
        readyDateTime: timeline.ReadyDateTime?.toISOString(),
        endDateTime: timeline.EndDateTime?.toISOString(),
      },
    },
    instanceGroupId,
    instanceFleetId,
    market,
    instanceType,
  }
}