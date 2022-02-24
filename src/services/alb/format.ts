import { Listener } from 'aws-sdk/clients/elbv2'
import startCase from 'lodash/startCase'

import t from '../../properties/translations'
import { AwsAlb, AwsAlbListener } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsAlb } from './data'

/**
 * ALBs
 */

const awsAlbListernerGraphFormat = (listener): AwsAlbListener => {
  const {
    ListenerArn: id,
    DefaultActions: rules = [],
    SslPolicy: sslPolicy,
    Protocol: protocol,
    Port: port,
  }: Listener = listener

  return {
    arn: id,
    settings: {
      sslPolicy,
      protocol: `${protocol}:${port} ${id}`,
      rules: rules.map(
        ({
          Order: order,
          Type: type,
          TargetGroupArn: targetGroupArn,
          RedirectConfig,
        }) => ({
          type,
          order: order?.toString(),
          targetGroupArn,
          redirectProtocol: RedirectConfig?.Protocol,
        })
      ),
    },
  }
}

export default ({
  service: alb,
  account,
  region,
}: {
  service: RawAwsAlb
  account: string
  region: string
}): AwsAlb => {
  // TODO: type this from aws
  const {
    LoadBalancerName: name,
    LoadBalancerArn: arn,
    DNSName: dnsName,
    Scheme: scheme,
    Type: type,
    Tags = {},
    State: { Code: status = '' } = {},
    CanonicalHostedZoneId: hostedZone,
    IpAddressType: ipAddressType,
    attributes: {
      'access_logs.s3.enabled': accessLogsEnabled,
      'routing.http.drop_invalid_header_fields.enabled':
        dropInvalidHeaderFields,
      'routing.http2.enabled': http2,
      'idle_timeout.timeout_seconds': timeoutSeconds,
      'deletion_protection.enabled': deletionProtection,
    },
    CreatedTime: createdAt,
    listeners = [],
  }: // attributes = {},
  // SecurityGroups: securityGroups = [],
  // AvailabilityZones: azs = [],
  RawAwsAlb = alb

  // let metaData: any = {}

  // if (!isEmpty(connections)) {
  //   metaData = { connections }
  // }

  const albResult = {
    id: arn,
    name,
    accountId: account,
    arn,
    dnsName,
    scheme,
    type: startCase(type),
    hostedZone,
    region,
    ipAddressType,
    idleTimeout: `${timeoutSeconds} ${t.seconds}`,
    deletionProtection: deletionProtection === t.true ? t.yes : t.no,
    http2: http2 === t.true ? t.yes : t.no,
    accessLogsEnabled: accessLogsEnabled === t.true ? t.yes : t.no,
    dropInvalidHeaderFields: dropInvalidHeaderFields === t.true ? t.yes : t.no,
    tags: formatTagsFromMap(Tags),
    createdAt: createdAt.toISOString(),
    status,
    listeners: listeners.map(awsAlbListernerGraphFormat),
  }
  return albResult
}
