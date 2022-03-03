// import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import { AwsSageMakerNotebookInstance } from '../../types/generated'
import { RawAwsSageMakerNotebookInstance } from './data'

/**
 * SageMakerNotebookInstance
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsSageMakerNotebookInstance
  region: string
}): AwsSageMakerNotebookInstance => {
  const {
    NotebookInstanceName: notebookInstanceName,
    NotebookInstanceArn: arn,
    NotebookInstanceStatus: notebookInstanceStatus,
    FailureReason: failureReason,
    Url: url,
    InstanceType: instanceType,
    SubnetId: subnetId,
    SecurityGroups: securityGroupIds,
    RoleArn: roleArn,
    KmsKeyId: kmsKeyId,
    NetworkInterfaceId: networkInterfaceId,
    CreationTime: creationTime,
    LastModifiedTime: lastModifiedTime,
    NotebookInstanceLifecycleConfigName: notebookInstanceLifecycleConfigName,
    DirectInternetAccess: directInternetAccess,
    VolumeSizeInGB: volumeSizeInGb,
    AcceleratorTypes: acceleratorTypes,
    DefaultCodeRepository: defaultCodeRepository,
    AdditionalCodeRepositories: additionalCodeRepositories,
    RootAccess: rootAccess,
    PlatformIdentifier: platformIdentifier,
  } = rawData

  return {
    id: arn,
    arn,
    notebookInstanceName,
    region,
    accountId: account,
    notebookInstanceStatus,
    failureReason,
    url,
    instanceType,
    subnetId,
    securityGroupIds,
    acceleratorTypes,
    creationTime: creationTime?.toISOString(),
    lastModifiedTime: lastModifiedTime?.toISOString(),
    roleArn,
    kmsKeyId,
    networkInterfaceId,
    notebookInstanceLifecycleConfigName,
    directInternetAccess,
    volumeSizeInGb,
    defaultCodeRepository,
    additionalCodeRepositories,
    rootAccess,
    platformIdentifier
  }
}
