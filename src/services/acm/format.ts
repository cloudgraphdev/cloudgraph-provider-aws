import { RawAwsAcm } from './data'
import { AwsAcm } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsAcm
  account: string
  region: string
}): AwsAcm => {
  const {
    CertificateArn: arn,
    DomainName: domainName,
    SubjectAlternativeNameSummaries: subjectAlternativeNameSummaries,
    HasAdditionalSubjectAlternativeNames: hasAdditionalSubjectAlternativeNames,
    Status: status,
    Type: type,
    KeyAlgorithm: keyAlgorithm,
    KeyUsages: keyUsages,
    ExtendedKeyUsages: extendedKeyUsages,
    InUse: inUse,
    Exported: exported,
    RenewalEligibility: renewalEligibility,
    NotBefore: notBefore,
    NotAfter: notAfter,
    CreatedAt: createdAt,
    IssuedAt: issuedAt,
    ImportedAt: importedAt,
    RevokedAt: revokedAt,
    Tags: tags,
  } = service

  return {
    id: arn,
    accountId,
    arn,
    region,
    domainName,
    subjectAlternativeNameSummaries,
    hasAdditionalSubjectAlternativeNames,
    status,
    type,
    keyAlgorithm,
    keyUsages,
    extendedKeyUsages,
    inUse,
    exported,
    renewalEligibility,
    notBefore: notBefore?.toISOString(),
    notAfter: notAfter?.toISOString(),
    createdAt: createdAt?.toISOString(),
    issuedAt: issuedAt?.toISOString(),
    importedAt: importedAt?.toISOString(),
    revokedAt: revokedAt?.toISOString(),
    tags: formatTagsFromMap(tags),
  }
}
