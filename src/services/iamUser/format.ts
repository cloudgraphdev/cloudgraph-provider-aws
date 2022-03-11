import isEmpty from 'lodash/isEmpty'

import { AwsIamGroup } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsIamUser } from '../iamUser/data'

/**
 * IAM User
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsIamUser
  account: string
  region: string
}): AwsIamGroup => {
  const {
    Arn: arn,
    UserName: name,
    Path: path,
    CreateDate: creationTime,
    PasswordLastUsed: passwordLastUsed,
    AccessKeyLastUsedData: accessKeys = [],
    MFADevices: mfaDevices = [],
    VirtualMFADevices: virtualMfaDevices = [],
    Groups: groups = [],
    Policies: inlinePolicies = [],
    ReportData: {
      AccessKey1LastRotated: accessKey1LastRotated,
      AccessKey2LastRotated: accessKey2LastRotated,
      PasswordEnabled: passwordEnabled,
      PasswordLastChanged,
      PasswordNextRotation,
      AccessKey1Active: accessKey1Active,
      AccessKey2Active: accessKey2Active,
      MfaActive: mfaActive,
    } = {
      PasswordEnabled: '',
      PasswordLastChanged: 'N/A',
      PasswordNextRotation: 'N/A',
      MfaActive: '',
      AccessKey1LastRotated: 'N/A',
      AccessKey2LastRotated: 'N/A',
    },
    Tags: tags = {},
  } = rawData

  // Access key
  const accessKeyData = []

  if (!isEmpty(accessKeys)) {
    accessKeys.map((key, index) => {
      const lastRotated =
        index === 0 ? accessKey1LastRotated : accessKey2LastRotated
      accessKeyData.push({
        accessKeyId: key.AccessKeyId,
        lastUsedDate: key.AccessKeyLastUsed.LastUsedDate?.toISOString(),
        lastUsedRegion: key.AccessKeyLastUsed.Region,
        lastUsedService: key.AccessKeyLastUsed.ServiceName,
        status: key.Status || 'Inactive',
        createDate: key.CreateDate?.toISOString(),
        lastRotated:
          lastRotated !== 'N/A'
            ? new Date(lastRotated)?.toISOString() || ''
            : '',
      })
    })
  }

  // MFA Devices
  const mfaData = []
  if (!isEmpty(mfaDevices)) {
    mfaDevices.map(({ SerialNumber, EnableDate }) => {
      mfaData.push({
        serialNumber: SerialNumber,
        enableDate: EnableDate?.toISOString(),
      })
    })
  }

  // Virtual MFA Devices
  const virtualMfaData = []
  if (!isEmpty(virtualMfaDevices)) {
    virtualMfaDevices.map(({ SerialNumber, EnableDate }) => {
      virtualMfaData.push({
        serialNumber: SerialNumber,
        enableDate: EnableDate?.toISOString(),
      })
    })
  }

  // Format User Tags
  const userTags = formatTagsFromMap(tags)

  let passwordLastChanged = ''
  let passwordNextRotation = ''

  if (
    PasswordLastChanged !== 'N/A' &&
    PasswordLastChanged !== 'not_supported'
  ) {
    passwordLastChanged = new Date(PasswordLastChanged)?.toISOString()
  }

  if (
    PasswordNextRotation !== 'N/A' &&
    PasswordNextRotation !== 'not_supported'
  ) {
    passwordNextRotation = new Date(PasswordNextRotation)?.toISOString()
  }

  const user = {
    id: arn,
    arn,
    accountId: account,
    name,
    path,
    creationTime: creationTime?.toISOString() || '',
    accessKeyData,
    mfaDevices: mfaData,
    virtualMfaDevices: virtualMfaData,
    accessKeysActive:
      accessKey1Active === 'true' || accessKey2Active === 'true',
    passwordLastUsed: passwordLastUsed?.toISOString() || '',
    passwordLastChanged,
    passwordNextRotation,
    passwordEnabled: passwordEnabled === 'true',
    mfaActive: mfaActive === 'true',
    groups,
    inlinePolicies,
    tags: userTags,
  }
  return user
}
