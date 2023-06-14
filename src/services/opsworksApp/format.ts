import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsOpsWorksApp } from './data'
import { AwsOpsWorksApp } from '../../types/generated'
import { opsworksAppArn } from '../../utils/generateArns'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsOpsWorksApp
  account: string
  region: string
}): AwsOpsWorksApp => {
  const {
    AppId: appId,
    StackId: stackId,
    Shortname: shortname,
    Name: name,
    Description: description,
    DataSources: dataSources,
    Type: type,
    AppSource: appSource,
    Domains: domains,
    EnableSsl: enableSsl,
    SslConfiguration: sslConfiguration,
    Attributes: attributes,
    CreatedAt: createdAt,
    Environment: environment,
  } = service

  const arn = opsworksAppArn({ region, account: accountId, appId: appId })

  return {
    id: appId,
    accountId,
    arn,
    region,
    stackId,
    shortname,
    name,
    description,
    dataSources: dataSources.map(ds => ({
      id: generateUniqueId({
        arn,
        ...ds,
      }),
      type: ds.Type,
      arn: ds.Arn,
      databaseName: ds.DatabaseName,
    })),
    type,
    appSource: {
      type: appSource?.Type,
      url: appSource?.Url,
      username: appSource?.Username,
      password: appSource?.Password,
      sshKey: appSource?.SshKey,
      revision: appSource?.Revision,
    },
    domains,
    enableSsl,
    sslConfiguration: {
      certificate: sslConfiguration?.Certificate,
      privateKey: sslConfiguration?.PrivateKey,
      chain: sslConfiguration?.Chain,
    },
    attributes: Object.keys(attributes).map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: attributes[key],
      }),
      key,
      value: attributes[key],
    })),
    createdAt,
    environment: environment.map(e => ({
      id: generateUniqueId({
        arn,
        ...e,
      }),
      key: e.Key,
      value: e.Value,
      secure: e.Secure,
    }))
  }
}
