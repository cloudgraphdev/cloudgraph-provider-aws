import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsApiGatewayDomainName } from './data'
import { AwsApiGatewayDomainName } from '../../types/generated'
import { domainNameArn } from '../../utils/generateArns'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayDomainName
  account: string
  region: string
}): AwsApiGatewayDomainName => {
  const {
    DomainName: domainName,
    ApiMappingSelectionExpression: apiMappingSelectionExpression,
    DomainNameConfigurations: domainNameConfigurations = [],
    Tags: tags = {},
  } = service

  const arn = domainNameArn({ region, account: accountId, name: domainName })

  return {
    id: arn,
    accountId,
    arn,
    region,
    domainName,
    apiMappingSelectionExpression,
    configurations:
      domainNameConfigurations?.map(dn => ({
        id: generateUniqueId({
          arn,
          ...dn,
        }),
        apiGatewayDomainName: dn.ApiGatewayDomainName,
        certificateArn: dn.CertificateArn,
        certificateName: dn.CertificateName,
        certificateUploadDate: dn.CertificateUploadDate?.toISOString(),
        domainNameStatus: dn.DomainNameStatus,
        domainNameStatusMessage: dn.DomainNameStatusMessage,
        endpointType: dn.EndpointType,
        securityPolicy: dn.SecurityPolicy,
        ownershipVerificationCertificateArn:
          dn.OwnershipVerificationCertificateArn,
      })) || [],
    tags: formatTagsFromMap(tags),
  }
}
