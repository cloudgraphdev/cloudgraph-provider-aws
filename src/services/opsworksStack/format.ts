import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsOpsWorksStack } from './data'
import { AwsOpsWorksStack } from '../../types/generated'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsOpsWorksStack
  account: string
  region: string
}): AwsOpsWorksStack => {
  const {
    StackId: stackId,
    Name: name,
    Arn: arn,
    VpcId: vpcId,
    Attributes: attributes,
    ServiceRoleArn: serviceRoleArn,
    DefaultInstanceProfileArn: defaultInstanceProfileArn,
    DefaultOs: defaultOs,
    HostnameTheme: hostnameTheme,
    DefaultAvailabilityZone: defaultAvailabilityZone,
    DefaultSubnetId: defaultSubnetId,
    CustomJson: customJson,
    ConfigurationManager: configurationManager,
    ChefConfiguration: chefConfiguration,
    UseCustomCookbooks: useCustomCookbooks,
    UseOpsworksSecurityGroups: useOpsworksSecurityGroups,
    CustomCookbooksSource: customCookbooksSource,
    DefaultSshKeyName: defaultSshKeyName,
    CreatedAt: createdAt,
    DefaultRootDeviceType: defaultRootDeviceType,
    AgentVersion: agentVersion,
  } = service

  return {
    id: stackId,
    accountId,
    arn,
    region,
    vpcId,
    attributes: Object.keys(attributes).map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: attributes[key],
      }),
      key,
      value: attributes[key],
    })),
    serviceRoleArn,
    defaultInstanceProfileArn,
    defaultOs,
    hostnameTheme,
    defaultAvailabilityZone,
    defaultSubnetId,
    customJson,
    configurationManager: {
      name: configurationManager?.Name,
      version: configurationManager?.Version,
    },
    chefConfiguration: {
      manageBerkshelf: chefConfiguration?.ManageBerkshelf,
      berkshelfVersion: chefConfiguration?.BerkshelfVersion,
    },
    useCustomCookbooks,
    useOpsworksSecurityGroups,
    customCookbooksSource: {
      type: customCookbooksSource?.Type,
      url: customCookbooksSource?.Url,
      username: customCookbooksSource?.Username,
      password: customCookbooksSource?.Password,
      sshKey: customCookbooksSource?.SshKey,
      revision: customCookbooksSource?.Revision,
    },
    defaultSshKeyName,
    createdAt,
    defaultRootDeviceType,
    agentVersion,
  }
}
