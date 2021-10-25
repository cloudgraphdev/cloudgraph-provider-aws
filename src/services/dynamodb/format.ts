import {
  KeySchemaElement,
  Projection,
  ProvisionedThroughputDescription,
} from 'aws-sdk/clients/dynamodb'
import cuid from 'cuid'
import { RawAwsDynamoDbTable } from './data'
import { formatTagsFromMap } from '../../utils/format';
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
} from '../../types/generated'

const formatKeySchema = (
  KeySchema: KeySchemaElement[]
): AwsDynamoDbTableIndexKeySchema[] =>
  KeySchema.map(({ AttributeName: attributeName, KeyType: keyType }) => ({
    id: cuid(),
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
    ...(lastIncreaseDateTime ? {
      lastIncreaseDateTime: lastIncreaseDateTime.toString()
    } : {}),
    ...(lastDecreaseDateTime ? {
      lastDecreaseDateTime: lastDecreaseDateTime.toString(),
    } : {}),
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

/**
 * DynamoDB
 */
export default ({
  service: dynamoDbTable,
  account,
  region
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
      id: cuid(),
      name: AttributeName,
      type,
    })
  )

  const billingModeSummary: AwsDynamoDbTableBillingSummary = {
    billingMode,
    ...(lastUpdateToPayPerRequestDateTime ? {
      lastUpdateToPayPerRequestDateTime:
        lastUpdateToPayPerRequestDateTime.toString(),
    } : {}),
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
        name: IndexName,
        arn,
        itemCount: ItemCount,
        keySchema: formatKeySchema(KeySchema),
        projection: formatProjection(localndexProjection),
        sizeInBytes,
      })
    )

  const replicas: AwsDynamoDbTableReplicaDescription[] = Replicas.map(
    ({
      RegionName: regionName,
      ReplicaStatus,
      ReplicaStatusDescription,
      ReplicaStatusPercentProgress,
      KMSMasterKeyId,
      ProvisionedThroughputOverride,
      GlobalSecondaryIndexes: ReplicasGlobalSecondaryIndexes,
      ReplicaInaccessibleDateTime,
    }) => ({
      id: cuid(),
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
        }) => ({ name: IndexName, readCapacityUnits })
      ),
      ...(ReplicaInaccessibleDateTime ? {
        replicaInaccessibleDateTime: ReplicaInaccessibleDateTime.toString(),
      }  : {}),
    })
  )

  const restoreSummary: AwsDynamoDbTableRestoreSummary = {
    sourceBackupArn,
    sourceTableArn,
    ...(restoreDateTime ? { restoreDateTime: restoreDateTime.toString() } : {}),
    ...(restoreInProgress ? {
      restoreInProgress: restoreInProgress.toString(),
    } : {}),
  }

  const sseDescription: AwsDynamoDbTableSseDescription = {
    status: sseStatus,
    sseType,
    kmsMasterKeyArn: sseKmsMasterKeyArn,
    ...(sseInaccessibleEncryptionDateTime ? {
      inaccessibleEncryptionDateTime:
        sseInaccessibleEncryptionDateTime.toString(),
    } : {}),
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
