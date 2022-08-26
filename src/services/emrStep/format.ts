import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsEmrStep } from '../../types/generated'
import { RawAwsEmrStep } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEmrStep
  account: string
  region: string
}): AwsEmrStep => {
  const {
    Id: id,
    Name: name,
    Config: config,
    ActionOnFailure: actionOnFailure,
    Status: status,
  } = service

  const {
    Jar: jar,
    Properties: properties,
    MainClass: mainClass,
    Args: args,
  } = config ?? {}

  const {
    State: state,
    StateChangeReason: stateChangeReason,
    FailureDetails: failureDetails,
    Timeline: timeline,
  } = status ?? {}

  const { Code: code, Message: message } = stateChangeReason ?? {}

  const {
    CreationDateTime: creationDateTime,
    StartDateTime: startDateTime,
    EndDateTime: endDateTime,
  } = timeline ?? {}

  return {
    id,
    accountId: account,
    region,
    name,
    config: {
      jar,
      properties: Object.keys(properties || {}).map(key => ({
        id: generateUniqueId({
          id,
          key,
          value: properties[key],
        }),
        key,
        value: properties[key],
      })),
      mainClass,
      args,
    },
    actionOnFailure,
    status: {
      state,
      stateChangeReason: {
        code,
        message,
      },
      failureDetails: {
        reason: failureDetails?.Reason,
        message: failureDetails?.Message,
        logFile: failureDetails?.LogFile,
      },
      timeline: {
        creationDateTime: creationDateTime?.toISOString(),
        startDateTime: startDateTime?.toISOString(),
        endDateTime: endDateTime?.toISOString(),
      },
    },
  }
}
