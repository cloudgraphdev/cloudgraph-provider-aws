import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsEksCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEksCluster } from './data'

export default ({
  service,
  account,
  region,
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

  const formattedKubernetesNetworkConfig = {
    serviceIpv4Cidr: kubernetesNetworkConfig?.serviceIpv4Cidr,
    serviceIpv6Cidr: kubernetesNetworkConfig?.serviceIpv6Cidr,
    ipFamily: kubernetesNetworkConfig?.ipFamily,
  }

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
    kubernetesNetworkConfig: formattedKubernetesNetworkConfig,
    logging: {
      clusterLogging: logging?.clusterLogging?.map(logSetup => ({
        id: generateUniqueId({
          arn,
          ...logSetup,
        }),
        ...logSetup,
      })),
    },
    identity,
    status,
    certificateAuthority,
    clientRequestToken,
    platformVersion,
    encryptionConfig: encryptionConfig?.map(config => ({
      id: generateUniqueId({
        arn,
        ...config,
      }),
      ...config,
    })),
    tags: formatTagsFromMap(Tags),
  }
}
