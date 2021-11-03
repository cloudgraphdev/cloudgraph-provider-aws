import cuid from 'cuid'
import { AwsEmrStep } from '../../types/generated'
import { RawAwsEmrStep } from './data'

export default ({
  service,
  account,
}: {
  service: RawAwsEmrStep
  account: string
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
  } = config

  const {
    State: state,
    StateChangeReason: stateChangeReason,
    FailureDetails: failureDetails,
    Timeline: timeline,
  } = status

  const { 
    Code: code, 
    Message: message 
  } = stateChangeReason

  const {
    CreationDateTime: creationDateTime,
    StartDateTime: startDateTime,
    EndDateTime: endDateTime,
  } = timeline

  return {
    id,
    accountId: account,
    name,
    config: {
      jar,
      properties: Object.keys(properties || {}).map(key => ({
        id: cuid(),
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