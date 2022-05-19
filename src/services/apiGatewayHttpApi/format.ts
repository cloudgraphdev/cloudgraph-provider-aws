import { RawAwsApiGatewayHttpApi } from './data'
import { AwsApiGatewayHttpApi } from '../../types/generated'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayHttpApi
  account: string
  region: string
}): AwsApiGatewayHttpApi => {
  const {
    ApiId: id,
    ApiEndpoint: apiEndpoint,
    ApiGatewayManaged: apiGatewayManaged,
    ApiKeySelectionExpression: apiKeySelectionExpression,
    CorsConfiguration: corsConfiguration = {},
    CreatedDate: createdDate,
    Description: description,
    DisableSchemaValidation: disableSchemaValidation,
    DisableExecuteApiEndpoint: disableExecuteApiEndpoint,
    ImportInfo: importInfo,
    Name: name,
    ProtocolType: protocolType,
    RouteSelectionExpression: routeSelectionExpression,
    Version: version,
    Warnings: warnings = [],
    Tags: tags = {},
  } = service
  const arn = apiGatewayRestApiArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    id,
  })

  return {
    id,
    accountId,
    arn,
    region,
    apiEndpoint,
    apiGatewayManaged,
    apiKeySelectionExpression,
    corsConfiguration: corsConfiguration ? ({
      allowCredentials: corsConfiguration.AllowCredentials,
      allowHeaders: corsConfiguration.AllowHeaders || [],
      allowMethods: corsConfiguration.AllowMethods || [],
      allowOrigins: corsConfiguration.AllowOrigins || [],
      exposeHeaders: corsConfiguration.ExposeHeaders || [],
      maxAge: corsConfiguration.MaxAge,
    }): {},
    createdDate: createdDate?.toISOString(),
    description,
    disableSchemaValidation,
    disableExecuteApiEndpoint,
    importInfo,
    name,
    protocolType,
    routeSelectionExpression,
    version,
    warnings,
    tags: formatTagsFromMap(tags),
  }
}
