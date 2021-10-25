import { ServerCertificateMetadata } from 'aws-sdk/clients/iam'

import resources from '../../enums/resources'
import { AwsIamServerCertificate } from '../../types/generated'
import { getIamGlobalId } from '../../utils/ids'

/**
 * IAM Server Certificate
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: ServerCertificateMetadata
  account: string
  region: string
}): AwsIamServerCertificate => {
  const {
    ServerCertificateId: id = '',
    ServerCertificateName: name = '',
    Arn: arn = '',
    Path: path = '',
    UploadDate,
    Expiration,
  } = rawData

  return {
    id: getIamGlobalId({
      accountId: account,
      region,
      resourceType: resources.iamServerCertificate,
    }),
    certificateId: id,
    arn,
    accountId: account,
    name,
    path,
    uploadDate: UploadDate?.toISOString() || '',
    expiration: Expiration?.toISOString() || '',
  }
}
