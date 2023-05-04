export default {
  alb: 'aws_lb',
  elb: 'aws_elb',
  vpc: 'aws_vpc',
  eip: 'aws_eip',
  nat: 'aws_nat_gateway',
  efs: 'aws_efs_file_system',
  igw: 'aws_internet_gateway',
  nacl: 'aws_network_acl',
  subnet: 'aws_subnet',
  kmsKey: 'aws_kms_key',
  region: 'aws_region', // Not a real TF resource, used to organize all regional resources
  account: 'aws_account', // Not a real TF resource, used to organize all regional resources
  iamPasswordPolicy: 'aws_iam_password_policy',
  iamSamlProvider: 'aws_iam_saml_provider',
  iamOpenIdConnectProvider: 'aws_iam_openidconnect_provider',
  iamServerCertificate: 'aws_iam_server_certificate',
  iamUser: 'aws_iam_user',
  iamRole: 'aws_iam_role',
  ecsTask: 'aws_ecs_task',
  iotThing: 'aws_iot_thing',
  s3Bucket: 'aws_s3_bucket',
  sqsQueue: 'aws_sqs_queue',
  iamGroup: 'aws_iam_group',
  snsTopic: 'aws_sns_topic',
  ebsSnapshot: 'aws_ebs_snapshot',
  ebsVolume: 'aws_ebs_volume',
  iamPolicy: 'aws_iam_policy',
  vpnGateway: 'aws_vpn_gateway',
  rdsCluster: 'aws_rds_cluster',
  emrCluster: 'aws_emr_cluster',
  ecsService: 'aws_ecs_service',
  ecsCluster: 'aws_ecs_cluster',
  dbInstance: 'aws_db_instance',
  eksCluster: 'aws_eks_cluster',
  routeTable: 'aws_route_table',
  albListener: 'aws_lb_listener',
  elbListener: 'aws_elb_listener', // Not a real TF resource, used to for classic ELBs
  ec2Instance: 'aws_instance',
  iamPolicies: 'aws_iam_polocies', // Not a real TF resource, used to organize all the policies
  route53Zone: 'aws_route53_zone',
  organization: 'aws_organizations_organization',
  vpnConnection: 'aws_vpn_connection',
  ecrRepository: 'aws_ecr_repository',
  dynamoDbTable: 'aws_dynamodb_table',
  kinesisStream: 'aws_kinesis_stream',
  securityGroup: 'aws_security_group',
  securityHub: 'aws_security_hub',
  iamRolePolicy: 'aws_iam_role_policy',
  opsWorksApp: 'aws_opsworks_application',
  opsWorksStack: 'aws_opsworks_stack',
  opsWorksInstance: 'aws_opsworks_instance',
  efsMountTarget: 'aws_efs_mount_target',
  route53ZRecord: 'aws_route53_record',
  lambdaFunction: 'aws_lambda_function',
  s3BucketPolicy: 'aws_s3_bucket_policy',
  transitGateway: 'aws_ec2_transit_gateway',
  customerGateway: 'aws_customer_gateway',
  redshiftCluster: 'aws_redshift_cluster',
  cognitoUserPool: 'aws_cognito_user_pool',
  snsSubscription: 'aws_sns_topic_subscription',
  apiGatewayStage: 'aws_api_gateway_stage',
  availabilityZone: 'aws_availability_zone',
  apiGatewayMethod: 'aws_api_gateway_method',
  autoscalingGroup: 'aws_autoscaling_group',
  volumeAttachment: 'aws_volume_attachment',
  sesEmailIdentity: 'aws_ses_email_identity',
  networkInterface: 'aws_network_interface',
  ecsTaskDefinition: 'aws_ecs_task_definition',
  apiGatewayRestApi: 'aws_api_gateway_rest_api',
  clientVpnEndpoint: 'aws_ec2_client_vpn_endpoint',
  apiGatewayResource: 'aws_api_gateway_resource',
  elastiCacheCluster: 'aws_elasticache_cluster',
  cognitoIdentityPool: 'aws_cognito_identity_pool',
  iamPolicyAttachment: 'aws_iam_policy_attachment',
  launchConfiguration: 'aws_launch_configuration',
  cloudformationStack: 'aws_cloudformation_stack',
  clout9EnvironmentEc2: 'aws_cloud9_environment_ec2',
  secretsManagerSecret: 'aws_secretsmanager_secret',
  organizationsAccount: 'aws_organizations_account',
  apiGatewayIntegration: 'aws_api_gateway_integration',
  cloudwatchMetricAlarm: 'aws_cloudwatch_metric_alarm',
  routeTableAssociation: 'aws_route_table_association',
  cloudFrontDistribution: 'aws_cloudfront_distribution',
  ecsContainerDefinition: 'aws_ecs_container_definition', // Not a read TF resource
  elastiCacheSubnetGroup: 'aws_elasticache_subnet_group',
  iamUserGroupMembership: 'aws_iam_user_group_membership',
  albTargetGroupAttachment: 'aws_lb_target_group_attachment',
  iamGroupPolicyAttachment: 'aws_iam_group_policy_attachment',
  elasticBeanstalkApplication: 'aws_elastic_beanstalk_application',
  elasticBeanstalkEnvironment: 'aws_elastic_beanstalk_environment',
  elastiCacheReplicationGroup: 'aws_elasticache_replication_group',
  transitGatewayVpcAttachment: 'aws_ec2_transit_gateway_vpc_attachment',
  kinesisFirehoseDeliveryStream: 'aws_kinesis_firehose_delivery_stream',
}
