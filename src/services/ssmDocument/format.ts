import { RawAwsSsmDocument } from './data'
import { AwsSsmDocument } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSsmDocument
  account: string
  region: string
}): AwsSsmDocument => {
  const {
    Name: name,
    CreatedDate: createdDate,
    DisplayName: displayName,
    Owner: owner,
    VersionName: versionName,
    PlatformTypes: platformTypes,
    DocumentVersion: documentVersion,
    DocumentType: documentType,
    SchemaVersion: schemaVersion,
    DocumentFormat: documentFormat,
    TargetType: targetType,
    Requires: requires,
    ReviewStatus: reviewStatus,
    Author: author,
    Tags: tags,
  } = service

  return {
    id: name,
    accountId: account,
    arn: name,
    region,
    name,
    createdDate: createdDate?.toISOString(),
    displayName,
    owner,
    versionName,
    platformTypes,
    documentVersion,
    documentType,
    schemaVersion,
    documentFormat,
    targetType,
    tags: formatTagsFromMap(tags),
    requires: requires?.map(r => ({
      id: `${r.Name}:${r.Version}`,
      name: r.Name,
      version: r.Version,
    })),
    reviewStatus,
    author,
  }
}
