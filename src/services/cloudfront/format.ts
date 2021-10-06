import {
  CacheBehavior,
  DefaultCacheBehavior,
  Origin,
} from 'aws-sdk/clients/cloudfront'
import cuid from 'cuid'
import isEmpty from 'lodash/isEmpty'

import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import {
  AwsCloudfront,
  AwsCloudfrontCacheBehavior,
  AwsCloudfrontCustomErrorResponse,
  AwsCloudfrontOriginData,
  AwsCloudfrontViewerCertificate,
} from '../../types/generated'
import { RawAwsCloudfront } from './data'

export const createCacheBehavior = (
  cache: CacheBehavior
): AwsCloudfrontCacheBehavior => {
  const {
    AllowedMethods: {
      Items: allowedMethods = [],
      CachedMethods: { Items: cachedMethods = [] },
    } = {},
    Compress: compress,
    DefaultTTL: defaultTtl,
    ForwardedValues: {
      Headers: { Items: headers } = {},
      QueryString: queryString,
    } = {},
    MaxTTL: maxTtl,
    MinTTL: minTtl,
    PathPattern: patternPath,
    SmoothStreaming: smoothStreaming,
    TargetOriginId: targetOriginId,
    ViewerProtocolPolicy: viewerProtocolPolicy,
  } = cache

  const forwardedValues = {
    headers,
    queryString: queryString ? t.yes : t.no,
  }

  return {
    id: cuid(),
    allowedMethods,
    cachedMethods,
    compress: compress ? t.yes : t.no,
    defaultTtl: defaultTtl ? `${defaultTtl} ${t.seconds}` : null,
    forwardedValues,
    maxTtl: maxTtl ? `${maxTtl} ${t.seconds}` : null,
    minTtl: minTtl ? `${minTtl} ${t.seconds}` : null,
    patternPath,
    smoothStreaming: smoothStreaming ? t.yes : t.no,
    targetOriginId,
    viewerProtocolPolicy,
  }
}

export const createDefaultCacheBehavior = (
  cache: DefaultCacheBehavior
): AwsCloudfrontCacheBehavior => {
  const {
    AllowedMethods: {
      Items: allowedMethods = [],
      CachedMethods: { Items: cachedMethods = [] },
    } = {},
    Compress: compress,
    DefaultTTL: defaultTtl,
    ForwardedValues: {
      Headers: { Items: headers } = {},
      QueryString: queryString,
    } = {},
    MaxTTL: maxTtl,
    MinTTL: minTtl,
    SmoothStreaming: smoothStreaming,
    TargetOriginId: targetOriginId,
    ViewerProtocolPolicy: viewerProtocolPolicy,
  } = cache

  const forwardedValues = {
    headers,
    queryString: queryString ? t.yes : t.no,
  }

  return {
    id: cuid(),
    allowedMethods,
    cachedMethods,
    compress: compress ? t.yes : t.no,
    defaultTtl: defaultTtl ? `${defaultTtl} ${t.seconds}` : null,
    forwardedValues,
    maxTtl: maxTtl ? `${maxTtl} ${t.seconds}` : null,
    minTtl: minTtl ? `${minTtl} ${t.seconds}` : null,
    smoothStreaming: smoothStreaming ? t.yes : t.no,
    targetOriginId,
    viewerProtocolPolicy,
  }
}

/**
 * CloudFront
 */

export default ({ service, account }: { service: RawAwsCloudfront, account: string }): AwsCloudfront => {
  const {
    config: {
      CallerReference: callerReference,
      DefaultRootObject: defaultRootObject,
      HttpVersion: httpVersion,
      Restrictions: {
        GeoRestriction: { Items: geoRestrictions },
      },
    },
    etag,
    summary: {
      ARN: arn,
      CacheBehaviors: { Items: orderedCacheBehavior = [] },
      CustomErrorResponses: { Items: cer = [] },
      DefaultCacheBehavior: defaultCacheBehavior,
      DomainName: domainName,
      Enabled: enabled,
      Id: id,
      IsIPV6Enabled: isIpv6Enabled,
      LastModifiedTime: lastModified,
      Origins: { Items: originData = [] },
      PriceClass: priceClass,
      Status: status,
      ViewerCertificate: {
        ACMCertificateArn: acmCertificateArn,
        CloudFrontDefaultCertificate: cloudfrontDefaultCertificate,
        IAMCertificateId: iamCertificateId,
        MinimumProtocolVersion: minimumProtocolVersion,
        SSLSupportMethod: sslSupportMethod,
      } = {},
      WebACLId: webAclId,
    },
    Tags = {},
  }: RawAwsCloudfront = service

  const customErrorResponse: AwsCloudfrontCustomErrorResponse[] = cer.map(
    ({
      ErrorCachingMinTTL: errorCachingMinTtl,
      ErrorCode: errorCode,
      ResponseCode: responseCode,
      ResponsePagePath: responsePagePath,
    }) => ({
      errorCachingMinTtl: `${errorCachingMinTtl} ${t.seconds}`,
      errorCode,
      responseCode,
      responsePagePath,
    })
  )

  const viewerCertificate: AwsCloudfrontViewerCertificate = {
    acmCertificateArn,
    cloudfrontDefaultCertificate: cloudfrontDefaultCertificate ? t.yes : t.no,
    iamCertificateId,
    minimumProtocolVersion,
    sslSupportMethod,
  }

  const origin: AwsCloudfrontOriginData[] = originData.map(
    ({
      CustomHeaders: { Items: customHeader = [] },
      CustomOriginConfig: {
        HTTPPort: httpPort,
        HTTPSPort: httpsPort,
        OriginProtocolPolicy: originProtocolPolicy,
        OriginSslProtocols: { Quantity: quantity, Items: items },
        OriginReadTimeout: originReadTimeout,
        OriginKeepaliveTimeout: originKeepaliveTimeout,
      } = {
        HTTPPort: null,
        HTTPSPort: null,
        OriginProtocolPolicy: null,
        OriginSslProtocols: { Quantity: 0, Items: [] },
        OriginReadTimeout: null,
        OriginKeepaliveTimeout: null,
      },
      DomainName: domainName,
      Id: originId,
      OriginPath: originPath,
    }: Origin) => ({
      customHeader: customHeader.map(({ HeaderName, HeaderValue }) => ({
        id: cuid(),
        name: HeaderName,
        value: HeaderValue,
      })),
      customOriginConfig: {
        httpPort,
        httpsPort,
        originProtocolPolicy,
        originSslProtocols: { quantity, items },
        originReadTimeout,
        originKeepaliveTimeout,
      },
      domainName,
      originId,
      originPath,
    })
  )

  return {
    id,
    accountId: account,
    arn,
    callerReference,
    customErrorResponse,
    orderedCacheBehavior: orderedCacheBehavior.map(item =>
      createCacheBehavior(item)
    ),
    defaultCacheBehavior: createDefaultCacheBehavior(defaultCacheBehavior),
    defaultRootObject,
    domainName,
    enabled: enabled ? t.yes : t.no,
    etag,
    geoRestrictions: !isEmpty(geoRestrictions)
      ? geoRestrictions.join(',')
      : 'none',
    httpVersion,
    ipv6Enabled: isIpv6Enabled ? t.yes : t.no,
    lastModified: lastModified.toISOString(),
    origin,
    priceClass,
    status,
    tags: formatTagsFromMap(Tags),
    viewerCertificate,
    webAclId,
  }
}
