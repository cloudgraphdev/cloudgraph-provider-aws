import { RawAwsSsmActivation } from './data'
import { AwsSsmActivation } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { ssmActivationArn } from '../../utils/generateArns'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSsmActivation
  account: string
  region: string
}): AwsSsmActivation => {
  const {
    ActivationId: activationId,
    Description: description,
    DefaultInstanceName: defaultInstanceName,
    IamRole: iamRole,
    RegistrationLimit: registrationLimit,
    RegistrationsCount: registrationsCount,
    ExpirationDate: expirationDate,
    Expired: expired,
    CreatedDate: createdDate,
    Tags: tags,
  } = service

  const arn = ssmActivationArn({ region, account, id: activationId })

  return {
    id: activationId,
    accountId: account,
    arn,
    region,
    description,
    defaultInstanceName,
    iamRole,
    registrationLimit,
    registrationsCount,
    expirationDate: expirationDate?.toISOString(),
    expired,
    createdDate: createdDate?.toISOString(),
    tags: formatTagsFromMap(tags),
  }
}
