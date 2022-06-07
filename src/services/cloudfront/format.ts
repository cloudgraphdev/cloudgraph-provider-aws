import { generateUniqueId } from '@cloudgraph/sdk'
import {
  CacheBehavior,
  DefaultCacheBehavior,
  Origin,
} from 'aws-sdk/clients/cloudfront'

import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import {
  AwsCloudfront,
  AwsCloudfrontCacheBehavior,
  AwsCloudfrontCustomErrorResponse,
  AwsCloudfrontOriginData,
  AwsCloudfrontViewerCertificate,
  AwsCloudfrontLoggingConfig,
} from '../../types/generated'
import { RawAwsCloudfront } from './data'

/**
 * CloudFront
 */

export default ({
  service,
  account,
}: {
  service: RawAwsCloudfront
  account: string
}): AwsCloudfront => {
  const {
    config: {
      CallerReference: callerReference,
      DefaultRootObject: defaultRootObject,
      HttpVersion: httpVersion,
      Restrictions: {
        GeoRestriction: {
          Items: locations = [],
          RestrictionType: restrictionType = '',
        },
      } = {
        GeoRestriction: { RestrictionType: '', Items: [], Quantity: 0 },
      },
      Logging: logging,
    },
    etag,
    summary: {
      ARN: arn,
      CacheBehaviors: { Items: orderedCacheBehavior = [] } = { Quantity: 0 },
      CustomErrorResponses: { Items: cer = [] } = { Quantity: 0 },
      DefaultCacheBehavior: defaultCacheBehavior,
      DomainName: domainName,
      Enabled: enabled,
      Id: id,
      IsIPV6Enabled: isIpv6Enabled,
      LastModifiedTime: lastModified,
      Origins: { Items: originData = [] } = { Quantity: 0, Items: [] },
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

  const createCacheBehavior = (
    cache: CacheBehavior
  ): AwsCloudfrontCacheBehavior => {
    const {
      AllowedMethods: {
        Items: allowedMethods = [],
        CachedMethods: { Items: cachedMethods = [] } = { Items: [] },
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
      id: generateUniqueId({
        arn,
        ...cache,
      }),
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

  const createDefaultCacheBehavior = (
    cache: DefaultCacheBehavior
  ): AwsCloudfrontCacheBehavior => {
    const {
      AllowedMethods: {
        Items: allowedMethods = [],
        CachedMethods: { Items: cachedMethods = [] } = { Items: [] },
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
      id: generateUniqueId({
        arn,
        ...cache,
      }),
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

  const customErrorResponses: AwsCloudfrontCustomErrorResponse[] = cer.map(
    ({
      ErrorCachingMinTTL: errorCachingMinTtl,
      ErrorCode: errorCode,
      ResponseCode: responseCode,
      ResponsePagePath: responsePagePath,
    }) => ({
      id: generateUniqueId({
        arn,
        errorCachingMinTtl,
        errorCode,
        responseCode,
        responsePagePath,
      }),
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

  const origins: AwsCloudfrontOriginData[] = originData.map(
    (origin: Origin) => {
      const {
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
      } = origin
      return {
        id: generateUniqueId({
          arn,
          ...origin,
        }),
        customHeaders: customHeader.map(({ HeaderName, HeaderValue }) => ({
          id: generateUniqueId({
            arn,
            HeaderName,
            HeaderValue,
          }),
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
      }
    }
  )

  const loggingConfig: AwsCloudfrontLoggingConfig = logging
    ? {
        enabled: logging.Enabled,
        includeCookies: logging.IncludeCookies,
        bucket: logging.Bucket,
        prefix: logging.Prefix,
      }
    : {}

  return {
    id,
    accountId: account,
    arn,
    callerReference,
    customErrorResponses,
    orderedCacheBehaviors: orderedCacheBehavior.map(item =>
      createCacheBehavior(item)
    ),
    defaultCacheBehavior: createDefaultCacheBehavior(defaultCacheBehavior),
    defaultRootObject,
    domainName,
    enabled: enabled ? t.yes : t.no,
    etag,
    geoRestriction: {
      restrictionType,
      locations,
    },
    httpVersion,
    ipv6Enabled: isIpv6Enabled ? t.yes : t.no,
    lastModified: lastModified.toISOString(),
    origins,
    priceClass,
    status,
    tags: formatTagsFromMap(Tags),
    viewerCertificate,
    webAclId,
    logging: loggingConfig,
  }
}
