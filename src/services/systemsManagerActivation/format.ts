import { RawAwsSystemManagerActivation } from './data'
import { AwsSystemManagerActivation } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { systemManagerActivationArn } from '../../utils/generateArns'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSystemManagerActivation
  account: string
  region: string
}): AwsSystemManagerActivation => {
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

  const arn = systemManagerActivationArn({ region, account, id: activationId })

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
