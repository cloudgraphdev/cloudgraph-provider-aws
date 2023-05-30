import { RawAwsRdsGlobalCluster } from './data'
import { AwsRdsGlobalCluster } from '../../types/generated'
import { generateUniqueId } from '@cloudgraph/sdk'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsRdsGlobalCluster
  account: string
  region: string
}): AwsRdsGlobalCluster => {
  const {
    GlobalClusterIdentifier: globalClusterIdentifier,
    GlobalClusterResourceId: globalClusterResourceId,
    GlobalClusterArn: arn,
    Status: status,
    Engine: engine,
    EngineVersion: engineVersion,
    DatabaseName: databaseName,
    StorageEncrypted: storageEncrypted,
    DeletionProtection: deletionProtection,
    GlobalClusterMembers = [],
    FailoverState = {},
  } = service


  const failoverState = {
    status: FailoverState.Status,
    fromDbClusterArn: FailoverState.FromDbClusterArn,
    toDbClusterArn: FailoverState.ToDbClusterArn,
  }

  const globalClusterMembers = GlobalClusterMembers.map(gc => ({
    id: generateUniqueId({
      arn,
      ...gc,
    }),
    dBClusterArn: gc.DBClusterArn,
    isWriter: gc.IsWriter,
    globalWriteForwardingStatus: gc.GlobalWriteForwardingStatus,
    readers: gc.Readers ?? [],
  }))


  return {
    id: arn,
    accountId: account,
    arn,
    region,
    globalClusterIdentifier,
    globalClusterResourceId,
    status,
    engine,
    engineVersion,
    databaseName,
    storageEncrypted,
    deletionProtection,
    globalClusterMembers,
    failoverState,

  }
}
