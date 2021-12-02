import cuid from 'cuid'
import { AwsEksCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEksCluster } from './data'

export default ({
  service,
  account,
  region
}: {
  service: RawAwsEksCluster
  account: string
  region: string
}): AwsEksCluster => {
  const {
    arn,
    name,
    createdAt,
    version,
    endpoint,
    resourcesVpcConfig,
    kubernetesNetworkConfig,
    logging,
    identity,
    status,
    certificateAuthority,
    clientRequestToken,
    platformVersion,
    encryptionConfig,
    Tags = {},
  } = service

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    name,
    createdAt: createdAt?.toISOString(),
    version,
    endpoint,
    resourcesVpcConfig,
    kubernetesNetworkConfig,
    logging: {
      clusterLogging: logging?.clusterLogging?.map(logSetup => ({
        id: cuid(),
        ...logSetup,
      })),
    },
    identity,
    status,
    certificateAuthority,
    clientRequestToken,
    platformVersion,
    encryptionConfig: encryptionConfig?.map(config => ({
      id: cuid(),
      ...config,
    })),
    tags: formatTagsFromMap(Tags),
  }
}