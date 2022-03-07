import cuid from 'cuid'
import { AwsSystemsManagerDocument } from '../../types/generated'
import { RawAwsSystemsManagerDocument } from './data'
import { formatTagsFromMap } from '../../utils/format'
import { ssmDocumentArn } from '../../utils/generateArns'

/**
 * SystemsManagerDocument
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsSystemsManagerDocument
  region: string
}): AwsSystemsManagerDocument => {
  const {
    Name: name,
    CreatedDate: createdDate,
    Owner: owner,
    PlatformTypes: platformTypes,
    DocumentVersion: documentVersion,
    DocumentType: documentType,
    SchemaVersion: schemaVersion,
    DocumentFormat: documentFormat,
    TargetType: targetType,
    Tags: tags,
    permissions
  } = rawData

  const formattedPermissions = {
    accountIds: permissions?.accountIds,
    accountSharingInfoList: permissions?.accountSharingInfoList?.map(({ AccountId, SharedDocumentVersion }) => ({
      id: cuid(),
      accountId: AccountId,
      sharedDocumentVersion: SharedDocumentVersion
    }))
  }
  const arn = ssmDocumentArn({ region, account, name })
  return {
    id: arn,
    arn,
    region,
    accountId: account,
    name,
    createdDate: createdDate?.toISOString(),
    owner,
    platformTypes,
    documentVersion,
    documentType,
    schemaVersion,
    documentFormat,
    targetType,
    tags: formatTagsFromMap(tags ?? {}),
    permissions: formattedPermissions
  }
}
