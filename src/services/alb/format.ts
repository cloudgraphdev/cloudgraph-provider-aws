import startCase from 'lodash/startCase'

import t from '../../properties/translations'
import { Aws_Alb, Aws_Alb_Listener } from '../../types/generated'

/**
 * ALBs
 */

const awsAlbListernerGraphFormat = (listener): Aws_Alb_Listener => {
  const {
    ListenerArn: id,
    DefaultActions: rules = [],
    SslPolicy: sslPolicy,
    Protocol: protocol,
    Port: port,
  }: any = listener

  return {
    arn: id,
    settings: {
      sslPolicy,
      protocol: `${protocol}:${port} ${id}`,
      rules: rules.map(
        ({ Order: order, Type: type, TargetGroupArn: targetGroupArn }) => ({
          type,
          order,
          targetGroupArn,
        })
      ),
    },
  }
}

export default ({ service: alb }): Aws_Alb => {
  // TODO: type this from aws
  const {
    LoadBalancerArn: arn,
    DNSName: dnsName,
    Scheme: scheme,
    Type: type,
    tags = {},
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
  any = alb

  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  // let metaData: any = {}

  // if (!isEmpty(connections)) {
  //   metaData = { connections }
  // }

  const albResult = {
    id: arn,
    arn,
    dnsName,
    scheme,
    type: startCase(type),
    hostedZone,
    // defaultVpc: 'test', TODO: add with vpc
    ipAddressType,
    idleTimeout: `${timeoutSeconds} ${t.seconds}`,
    deletionProtection: deletionProtection === t.true ? t.yes : t.no,
    http2: http2 === t.true ? t.yes : t.no,
    accessLogsEnabled: accessLogsEnabled === t.true ? t.yes : t.no,
    dropInvalidHeaderFields: dropInvalidHeaderFields === t.true ? t.yes : t.no,
    tags,
    createdAt,
    status,
    listeners: listeners.map(awsAlbListernerGraphFormat),
  }
  return albResult
}
