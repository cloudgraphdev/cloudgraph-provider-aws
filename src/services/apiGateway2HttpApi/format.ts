import { RawAwsApiGatewayV2HttpApi } from './data'
import { AwsApiGatewayHttpApi } from '../../types/generated'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayV2HttpApi
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
    authorizers = [],
    deployments = [],
    models = [],
    stages = [],
    integrations = [],
    routes = [],
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
    corsConfiguration: corsConfiguration
      ? {
          allowCredentials: corsConfiguration.AllowCredentials,
          allowHeaders: corsConfiguration.AllowHeaders || [],
          allowMethods: corsConfiguration.AllowMethods || [],
          allowOrigins: corsConfiguration.AllowOrigins || [],
          exposeHeaders: corsConfiguration.ExposeHeaders || [],
          maxAge: corsConfiguration.MaxAge,
        }
      : {},
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
    authorizers: authorizers.map(
      ({
        AuthorizerId: authorizerId,
        AuthorizerCredentialsArn: authorizerCredentialsArn,
        AuthorizerPayloadFormatVersion: authorizerPayloadFormatVersion,
        AuthorizerResultTtlInSeconds: authorizerResultTtlInSeconds,
        AuthorizerType: authorizerType,
        AuthorizerUri: authorizerUri,
        EnableSimpleResponses: enableSimpleResponses,
        IdentitySource = [],
        IdentityValidationExpression: identityValidationExpression,
        Name,
      }) => ({
        authorizerId,
        authorizerCredentialsArn,
        authorizerPayloadFormatVersion,
        authorizerResultTtlInSeconds,
        authorizerType,
        authorizerUri,
        enableSimpleResponses,
        identitySources: IdentitySource.map(x => x),
        identityValidationExpression,
        name: Name,
      })
    ),
    deployments: deployments.map(
      ({
        AutoDeployed: autoDeployed,
        CreatedDate,
        DeploymentId: deploymentId,
        DeploymentStatus: deploymentStatus,
        DeploymentStatusMessage: deploymentStatusMessage,
        Description,
      }) => ({
        autoDeployed,
        createdDate: CreatedDate?.toISOString(),
        deploymentId,
        deploymentStatus,
        deploymentStatusMessage,
        description: Description,
      })
    ),
    models: models.map(
      ({
        ModelId: modelId,
        ContentType: contentType,
        Description,
        Name,
        Schema: schema,
      }) => ({
        modelId,
        contentType,
        description: Description,
        name: Name,
        schema,
      })
    ),
    stages: stages.map(
      ({
        ApiGatewayManaged,
        AutoDeploy: autoDeploy,
        ClientCertificateId: clientCertificateId,
        CreatedDate,
        DeploymentId: deploymentId,
        Description,
        LastDeploymentStatusMessage: lastDeploymentStatusMessage,
        LastUpdatedDate,
        StageName: stageName,
        StageVariables: stageVariables,
      }) => ({
        apiGatewayManaged: ApiGatewayManaged,
        autoDeploy,
        clientCertificateId,
        createdDate: CreatedDate?.toISOString(),
        deploymentId,
        description: Description,
        lastDeploymentStatusMessage,
        lastUpdatedDate: LastUpdatedDate?.toISOString(),
        stageName,
        stageVariables,
      })
    ),
    integrations: integrations.map(
      ({
        ApiGatewayManaged,
        ConnectionId: connectionId,
        ConnectionType: connectionType,
        ContentHandlingStrategy: contentHandlingStrategy,
        CredentialsArn: credentialsArn,
        Description,
        IntegrationId: integrationId,
        IntegrationMethod: integrationMethod,
        IntegrationResponseSelectionExpression:
          integrationResponseSelectionExpression,
        IntegrationSubtype: integrationSubtype,
        IntegrationType: integrationType,
        IntegrationUri: integrationUri,
        PassthroughBehavior: passthroughBehavior,
        PayloadFormatVersion: payloadFormatVersion,
        TemplateSelectionExpression: templateSelectionExpression,
        TimeoutInMillis: timeoutInMillis,
        integrationResponses,
      }) => ({
        apiGatewayManaged: ApiGatewayManaged,
        connectionId,
        connectionType,
        contentHandlingStrategy,
        credentialsArn,
        description: Description,
        integrationId,
        integrationMethod,
        integrationResponseSelectionExpression,
        integrationSubtype,
        integrationType,
        integrationUri,
        passthroughBehavior,
        payloadFormatVersion,
        templateSelectionExpression,
        timeoutInMillis,
        responses: integrationResponses.map(
          ({
            ContentHandlingStrategy,
            IntegrationResponseId: integrationResponseId,
            IntegrationResponseKey: integrationResponseKey,
            TemplateSelectionExpression,
          }) => ({
            contentHandlingStrategy: ContentHandlingStrategy,
            integrationResponseId,
            integrationResponseKey,
            templateSelectionExpression: TemplateSelectionExpression,
          })
        ),
      })
    ),
    routes: routes.map(
      ({
        ApiGatewayManaged,
        ApiKeyRequired: apiKeyRequired,
        AuthorizationScopes: authorizationScopes,
        AuthorizationType: authorizationType,
        AuthorizerId: authorizerId,
        ModelSelectionExpression: modelSelectionExpression,
        OperationName: operationName,
        RouteId: routeId,
        RouteKey: routeKey,
        RouteResponseSelectionExpression: routeResponseSelectionExpression,
        Target: target,
        routeResponses,
      }) => ({
        apiGatewayManaged: ApiGatewayManaged,
        apiKeyRequired,
        authorizationScopes,
        authorizationType,
        authorizerId,
        modelSelectionExpression,
        operationName,
        routeId,
        routeKey,
        routeResponseSelectionExpression,
        target,
        responses: routeResponses.map(
          ({
            ModelSelectionExpression,
            RouteResponseId: routeResponseId,
            RouteResponseKey: routeResponseKey,
          }) => ({
            modelSelectionExpression: ModelSelectionExpression,
            routeResponseId,
            routeResponseKey,
          })
        ),
      })
    ),
    tags: formatTagsFromMap(tags),
  }
}
