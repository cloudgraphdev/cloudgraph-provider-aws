import { ServerCertificateMetadata } from 'aws-sdk/clients/iam'

import { AwsIamServerCertificate } from '../../types/generated'

/**
 * IAM Server Certificate
 */

export default ({
  service: rawData,
  account,
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
    id: arn,
    certificateId: id,
    arn,
    accountId: account,
    name,
    path,
    uploadDate: UploadDate?.toISOString() || '',
    expiration: Expiration?.toISOString() || '',
  }
}
