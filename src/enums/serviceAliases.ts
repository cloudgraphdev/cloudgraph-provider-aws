import services from './services'

export default {
  [services.alb]: 'albs',
  [services.apiGatewayDomainName]: 'apiGatewayDomainNames',
  [services.apiGatewayHttpApi]: 'apiGatewayHttpApis',
  [services.apiGatewayResource]: 'apiGatewayResources',
  [services.apiGatewayRestApi]: 'apiGatewayRestApis',
  [services.apiGatewayStage]: 'apiGatewayStages',
  [services.asg]: 'asgs',
  [services.athenaDataCatalog]: 'athenaDataCatalogs',
  [services.cloud9]: 'cloud9Environments',
  [services.cloudFormationStack]: 'cloudFormationStacks',
  [services.cloudFormationStackSet]: 'cloudFormationStackSets',
  [services.cloudfront]: 'cloudfrontDistributions',
  [services.cloudwatchLog]: 'cloudwatchLogs',
  [services.codebuild]: 'codebuilds',
  [services.configurationRecorder]: 'configurationRecorders',
  [services.dmsReplicationInstance]: 'dmsReplicationInstances',
  [services.ebsSnapshot]: 'ebsSnapshots',
  [services.ec2Instance]: 'ec2Instances',
  [services.ecsCluster]: 'ecsClusters',
  [services.ecsContainer]: 'ecsContainers',
  [services.ecsService]: 'ecsServices',
  [services.ecsTask]: 'ecsTasks',
  [services.ecsTaskDefinition]: 'ecsTaskDefinitions',
  [services.ecsTaskSet]: 'ecsTaskSets',
  [services.eksCluster]: 'eksClusters',
  [services.elastiCacheCluster]: 'elastiCacheClusters',
  [services.elastiCacheReplicationGroup]: 'elastiCacheReplicationGroups',
  [services.elasticBeanstalkApp]: 'elasticBeanstalkApps',
  [services.elasticBeanstalkEnv]: 'elasticBeanstalkEnvs',
  [services.elasticSearchDomain]: 'elasticSearchDomains',
  [services.elb]: 'elbs',
  [services.emrCluster]: 'emrClusters',
  [services.emrInstance]: 'emrInstances',
  [services.emrStep]: 'emrSteps',
  [services.flowLog]: 'flowLogs',
  [services.glueJob]: 'glueJobs',
  [services.glueRegistry]: 'glueRegistries',
  [services.guardDutyDetector]: 'guardDutyDetectors',
  [services.iamAccessAnalyzer]: 'iamAccessAnalyzers',
  [services.iamGroup]: 'iamGroups',
  [services.iamOpenIdConnectProvider]: 'iamOpenIdConnectProviders',
  [services.iamPasswordPolicy]: 'iamPasswordPolicies',
  [services.iamPolicy]: 'iamPolicies',
  [services.iamRole]: 'iamRoles',
  [services.iamSamlProvider]: 'iamSamlProviders',
  [services.iamServerCertificate]: 'iamServerCertificates',
  [services.iamInstanceProfile]: 'iamInstanceProfiles',
  [services.iamUser]: 'iamUsers',
  [services.kinesisStream]: 'kinesisStreams',
  [services.lambda]: 'lambdaFunctions',
  [services.managedAirflow]: 'managedAirflows',
  [services.managedPrefixList]: 'managedPrefixLists',
  [services.nat]: 'natGateway',
  [services.networkInterface]: 'networkInterfaces',
  [services.opsWorksApp]: 'opsWorksApps',
  [services.opsWorksStack]: 'opsWorksStacks',
  [services.opsWorksInstance]: 'opsWorksInstances',
  [services.organization]: 'organizations',
  [services.rdsCluster]: 'rdsClusters',
  [services.rdsClusterSnapshot]: 'rdsClusterSnapshots',
  [services.rdsDbInstance]: 'rdsDbInstances',
  [services.redshiftCluster]: 'redshiftClusters',
  [services.route53HostedZone]: 'route53HostedZones',
  [services.route53Record]: 'route53Records',
  [services.routeTable]: 'routeTables',
  [services.sageMakerExperiment]: 'sageMakerExperiments',
  [services.sageMakerNotebookInstance]: 'sageMakerNotebookInstances',
  [services.sageMakerProject]: 'sageMakerProjects',
  [services.secretsManager]: 'secretsManager',
  [services.sg]: 'securityGroups',
  [services.securityHub]: 'securityHubs',
  [services.subnet]: 'subnets',
  [services.systemsManagerDocument]: 'systemsManagerDocuments',
  [services.systemsManagerInstance]: 'systemsManagerInstances',
  [services.transitGateway]: 'transitGateways',
  [services.transitGatewayAttachment]: 'transitGatewayAttachments',
  [services.transitGatewayRouteTable]: 'transitGatewayRouteTables',
  [services.vpcEndpoint]: 'vpcEndpoints',
  [services.vpnConnection]: 'vpnConnections',
  [services.vpcPeeringConnection]: 'vpcPeeringConnections',
}
