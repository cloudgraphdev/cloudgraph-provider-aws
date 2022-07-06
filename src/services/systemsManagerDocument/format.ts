import { generateUniqueId } from '@cloudgraph/sdk'

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
    permissions,
  } = rawData

  const arn = ssmDocumentArn({ region, account, name })

  const formattedPermissions = {
    accountIds: permissions?.accountIds,
    accountSharingInfoList: permissions?.accountSharingInfoList?.map(
      ({ AccountId, SharedDocumentVersion }) => ({
        id: generateUniqueId({
          arn,
          AccountId,
          SharedDocumentVersion,
        }),
        accountId: AccountId,
        sharedDocumentVersion: SharedDocumentVersion,
      })
    ),
  }
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
    permissions: formattedPermissions,
  }
}
