import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { AwsGuardDutyDetector } from '../../types/generated'
import { RawAwsGuardDutyDetector } from './data'
import { guardDutyArn } from '../../utils/generateArns'

/**
 * GuardDutyDetector
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsGuardDutyDetector
  region: string
}): AwsGuardDutyDetector => {
  const {
    id,
    CreatedAt: createdAt,
    FindingPublishingFrequency: findingPublishingFrequency,
    ServiceRole: serviceRole,
    Status: status,
    UpdatedAt: updatedAt,
    DataSources: dataSources,
    members = [],
    Tags,
  } = rawData

  const arn = guardDutyArn({ region, account, detectorId: id })

  const formattedDataSources = {
    cloudTrail: {
      status: dataSources?.CloudTrail?.Status,
    },
    dnsLogs: {
      status: dataSources?.DNSLogs?.Status,
    },
    flowLogs: {
      status: dataSources?.FlowLogs?.Status,
    },
    s3Logs: {
      status: dataSources?.S3Logs?.Status,
    },
    // kubernetes: { TODO: k8s logs support, maybe need to update aws sdk?
    //   auditLogs: {
    //     status: dataSources?.
    //   }
    // }
  }

  const mappedMembers = members?.map(member => ({
    id: generateUniqueId({
      arn,
      ...member,
    }),
    accountId: member?.AccountId,
    detectorId: member?.DetectorId,
    masterId: member?.MasterId,
    email: member?.Email,
    relationshipStatus: member?.RelationshipStatus,
    invitedAt: new Date(member?.InvitedAt)?.toISOString(),
    updatedAt: new Date(member?.UpdatedAt)?.toISOString(),
  }))

  return {
    id,
    arn,
    region,
    accountId: account,
    createdAt: new Date(createdAt)?.toISOString(),
    updatedAt: new Date(updatedAt)?.toISOString(),
    findingPublishingFrequency,
    serviceRole,
    status,
    members: mappedMembers,
    dataSources: formattedDataSources,
    tags: formatTagsFromMap(Tags ?? {}),
  }
}
