import { generateUniqueId } from '@cloudgraph/sdk'
import {
  KeySchemaElement,
  Projection,
  ProvisionedThroughputDescription,
  AutoScalingSettingsDescription,
} from 'aws-sdk/clients/dynamodb'
import { isEmpty } from 'lodash'

import { RawAwsDynamoDbTable } from './data'
import { formatTagsFromMap } from '../../utils/format'
import {
  AwsDynamoDbTable,
  AwsDynamoDbTableAttributes,
  AwsDynamoDbTableBillingSummary,
  AwsDynamoDbTableGlobalSecondaryIndexDescription,
  AwsDynamoDbTableIndexKeySchema,
  AwsDynamoDbTableIndexProjection,
  AwsDynamoDbTableLocalSecondaryIndexDescription,
  AwsDynamoDbTableProvisionedThroughputDescription,
  AwsDynamoDbTableReplicaDescription,
  AwsDynamoDbTableRestoreSummary,
  AwsDynamoDbTableSseDescription,
  AwsDynamoDbTableStreamSpecification,
  AwsDynamoDbTableAutoScalingSettingsDescription,
} from '../../types/generated'

const formatKeySchema = (
  KeySchema: KeySchemaElement[]
): AwsDynamoDbTableIndexKeySchema[] =>
  KeySchema.map(({ AttributeName: attributeName, KeyType: keyType }) => ({
    id: generateUniqueId({
      attributeName,
      keyType,
    }),
    attributeName,
    keyType,
  }))

const formatProvisionedThroughput = (
  provisionedThroughput: ProvisionedThroughputDescription = {}
): AwsDynamoDbTableProvisionedThroughputDescription => {
  const {
    LastIncreaseDateTime: lastIncreaseDateTime,
    LastDecreaseDateTime: lastDecreaseDateTime,
    NumberOfDecreasesToday: numberOfDecreasesToday,
    ReadCapacityUnits: readCapacityUnits,
    WriteCapacityUnits: writeCapacityUnits,
  } = provisionedThroughput
  return {
    ...(lastIncreaseDateTime
      ? {
          lastIncreaseDateTime: lastIncreaseDateTime.toString(),
        }
      : {}),
    ...(lastDecreaseDateTime
      ? {
          lastDecreaseDateTime: lastDecreaseDateTime.toString(),
        }
      : {}),
    numberOfDecreasesToday,
    readCapacityUnits,
    writeCapacityUnits,
  }
}

const formatProjection = (
  projection: Projection = {}
): AwsDynamoDbTableIndexProjection => {
  const { ProjectionType: type, NonKeyAttributes: nonKeyAttributes = [] } =
    projection
  return {
    type,
    nonKeyAttributes,
  }
}

const formatAutoScalingSettingsDescription = (
  setting: AutoScalingSettingsDescription = {}
): AwsDynamoDbTableAutoScalingSettingsDescription => {
  if (isEmpty(setting)) {
    return {}
  }
  const {
    MinimumUnits: minimumUnits,
    MaximumUnits: maximumUnits,
    AutoScalingDisabled: autoScalingDisabled,
    AutoScalingRoleArn: autoScalingRoleArn,
    ScalingPolicies: scalingPolicies = [],
  } = setting

  return {
    minimumUnits,
    maximumUnits,
    autoScalingDisabled,
    autoScalingRoleArn,
    scalingPolicies: scalingPolicies?.map(
      ({
        PolicyName: policyName,
        TargetTrackingScalingPolicyConfiguration: config,
      }) => ({
        id: generateUniqueId({
          setting,
          policyName,
          config,
        }),
        policyName,
        disableScaleIn: config?.DisableScaleIn,
        scaleInCooldown: config?.ScaleInCooldown,
        scaleOutCooldown: config?.ScaleOutCooldown,
        targetValue: config?.TargetValue,
      })
    ),
  }
}

/**
 * DynamoDB
 */
export default ({
  service: dynamoDbTable,
  account,
  region,
}: {
  service: RawAwsDynamoDbTable
  account: string
  region: string
}): AwsDynamoDbTable => {
  const {
    TableId: id,
    TableName: name,
    TableArn: arn,
    CreationDateTime: creationDate,
    AttributeDefinitions = [],
    BillingModeSummary: {
      BillingMode: billingMode,
      LastUpdateToPayPerRequestDateTime: lastUpdateToPayPerRequestDateTime,
    } = {},
    GlobalSecondaryIndexes = [],
    GlobalTableVersion: globalTableVersion,
    LatestStreamArn: latestStreamArn,
    LatestStreamLabel: latestStreamLabel,
    LocalSecondaryIndexes = [],
    ItemCount: itemCount,
    KeySchema: TableKeySchema = [],
    ProvisionedThroughput: TableProvisionedThroughput = {},
    ttlEnabled,
    pointInTimeRecoveryEnabled,
    Replicas = [],
    RestoreSummary: {
      SourceBackupArn: sourceBackupArn,
      SourceTableArn: sourceTableArn,
      RestoreDateTime: restoreDateTime,
      RestoreInProgress: restoreInProgress,
    } = {},
    SSEDescription: {
      Status: sseStatus,
      SSEType: sseType,
      KMSMasterKeyArn: sseKmsMasterKeyArn,
      InaccessibleEncryptionDateTime: sseInaccessibleEncryptionDateTime,
    } = {},
    StreamSpecification: {
      StreamEnabled: streamsEnabled,
      StreamViewType: streamViewType,
    } = {},
    TableStatus,
    TableSizeBytes,
    Tags = {},
  } = dynamoDbTable

  const attributes: AwsDynamoDbTableAttributes[] = AttributeDefinitions.map(
    ({ AttributeName, AttributeType: type }) => ({
      id: generateUniqueId({
        arn,
        AttributeName,
        type,
      }),
      name: AttributeName,
      type,
    })
  )

  const billingModeSummary: AwsDynamoDbTableBillingSummary = {
    billingMode,
    ...(lastUpdateToPayPerRequestDateTime
      ? {
          lastUpdateToPayPerRequestDateTime:
            lastUpdateToPayPerRequestDateTime.toString(),
        }
      : {}),
  }

  const globalIndexes: AwsDynamoDbTableGlobalSecondaryIndexDescription[] =
    GlobalSecondaryIndexes.map(
      ({
        IndexName,
        KeySchema,
        ItemCount,
        Projection: globalIndexProjection = {},
        IndexSizeBytes: sizeInBytes,
        IndexStatus: status,
        Backfilling: backfilling,
        ProvisionedThroughput: globalIndexProvisionedThroughput = {},
      }) => ({
        id: generateUniqueId({
          arn,
          IndexName,
          KeySchema,
          ItemCount,
          globalIndexProjection,
          sizeInBytes,
          status,
          backfilling,
          globalIndexProvisionedThroughput,
        }),
        name: IndexName,
        arn,
        itemCount: ItemCount,
        keySchema: formatKeySchema(KeySchema),
        projection: formatProjection(globalIndexProjection),
        sizeInBytes,
        status,
        backfilling,
        provisionedThroughput: formatProvisionedThroughput(
          globalIndexProvisionedThroughput
        ),
      })
    )

  const localIndexes: AwsDynamoDbTableLocalSecondaryIndexDescription[] =
    LocalSecondaryIndexes.map(
      ({
        IndexName,
        KeySchema,
        ItemCount,
        Projection: localndexProjection = {},
        IndexSizeBytes: sizeInBytes,
      }) => ({
        id: generateUniqueId({
          arn,
          IndexName,
          KeySchema,
          ItemCount,
          localndexProjection,
          sizeInBytes,
        }),
        name: IndexName,
        arn,
        itemCount: ItemCount,
        keySchema: formatKeySchema(KeySchema),
        projection: formatProjection(localndexProjection),
        sizeInBytes,
      })
    )

  const replicas: AwsDynamoDbTableReplicaDescription[] = Replicas.map(
    replica => {
      const {
        RegionName: regionName,
        ReplicaStatus,
        ReplicaStatusDescription,
        ReplicaStatusPercentProgress,
        KMSMasterKeyId,
        ProvisionedThroughputOverride,
        GlobalSecondaryIndexes: ReplicasGlobalSecondaryIndexes = [],
        ReplicaInaccessibleDateTime,
        AutoScaling: {
          ReplicaProvisionedReadCapacityAutoScalingSettings:
            readCapacityAutoScalingSettings = {},
          ReplicaProvisionedWriteCapacityAutoScalingSettings:
            writeCapacityAutoScalingSettings = {},
        } = {},
      } = replica
      return {
        id: generateUniqueId({
          arn,
          ...replica,
        }),
        regionName,
        status: ReplicaStatus,
        statusDescription: ReplicaStatusDescription,
        statusPercentProgress: ReplicaStatusPercentProgress,
        kmsMasterKeyId: KMSMasterKeyId,
        provisionedThroughput: ProvisionedThroughputOverride,
        globalSecondaryIndexes: ReplicasGlobalSecondaryIndexes.map(
          ({
            IndexName,
            ProvisionedThroughputOverride: {
              ReadCapacityUnits: readCapacityUnits,
            },
          }) => ({
            id: generateUniqueId({
              arn,
              IndexName,
              ProvisionedThroughputOverride,
            }),
            name: IndexName,
            readCapacityUnits,
          })
        ),
        ...(ReplicaInaccessibleDateTime
          ? {
              replicaInaccessibleDateTime:
                ReplicaInaccessibleDateTime.toString(),
            }
          : {}),
        provisionedReadCapacityAutoScalingSettings:
          formatAutoScalingSettingsDescription(readCapacityAutoScalingSettings),
        provisionedWriteCapacityAutoScalingSettings:
          formatAutoScalingSettingsDescription(
            writeCapacityAutoScalingSettings
          ),
      }
    }
  )

  const restoreSummary: AwsDynamoDbTableRestoreSummary = {
    sourceBackupArn,
    sourceTableArn,
    ...(restoreDateTime ? { restoreDateTime: restoreDateTime.toString() } : {}),
    ...(restoreInProgress
      ? {
          restoreInProgress: restoreInProgress.toString(),
        }
      : {}),
  }

  const sseDescription: AwsDynamoDbTableSseDescription = {
    status: sseStatus,
    sseType,
    kmsMasterKeyArn: sseKmsMasterKeyArn,
    ...(sseInaccessibleEncryptionDateTime
      ? {
          inaccessibleEncryptionDateTime:
            sseInaccessibleEncryptionDateTime.toString(),
        }
      : {}),
  }

  const streamSpecification: AwsDynamoDbTableStreamSpecification = {
    streamsEnabled,
    streamViewType,
  }

  return {
    id,
    arn,
    region,
    accountId: account,
    attributes,
    billingModeSummary,
    creationDate: creationDate.toString(),
    globalIndexes,
    globalTableVersion,
    itemCount,
    keySchema: formatKeySchema(TableKeySchema),
    latestStreamArn,
    latestStreamLabel,
    localIndexes,
    name,
    pointInTimeRecoveryEnabled,
    provisionedThroughput: formatProvisionedThroughput(
      TableProvisionedThroughput
    ),
    replicas,
    restoreSummary,
    sizeInBytes: TableSizeBytes,
    sseDescription,
    status: TableStatus,
    streamSpecification,
    tags: formatTagsFromMap(Tags),
    ttlEnabled,
  }
}
