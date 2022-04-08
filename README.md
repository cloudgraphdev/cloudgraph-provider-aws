# CloudGraph AWS Provider

Use the CloudGraph AWS Provider to scan and normalize cloud infrastructure using the [AWS SDK](https://github.com/aws/aws-sdk-js)

<!-- toc -->
- [Docs](#install)
- [Install](#install)
- [Authentication](#authentication)
- [Multi Account](#multi-account)
- [Configuration](#configuration)
- [Supported Services](#supported-services)
<!-- tocstop -->

# Docs

⭐ [CloudGraph Readme](https://github.com/cloudgraphdev/cli)  

💻 [Full CloudGraph Documentation Including AWS Examples](https://docs.cloudgraph.dev)
# Install

Install the aws provider in CloudGraph

```
cg init aws
```

# Authentication

Authenticate the CloudGraph AWS Provider any of the following ways:

- Credentials from env variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`
- Credentials found in the `credentials` under `~/.aws` (any profile, defaults to `default`)

CloudGraph needs read permissions in order to ingest your data. To keep things easy you can use the same permissions that we use internally when we run CloudGraph to power AutoCloud. Here are the [AWS Docs](https://docs.autocloud.dev/connect-an-environment/aws) for generating the correct Role (feel free to leave out AutoCloud specific configuration).

# Multi Account

CloudGraph is able to scan multiple AWS accounts at once. This is done by setting up multiple profiles in your `~/.aws/credentials` file and then selecting all the profiles you want to crawl when running `cg init`. All resources will be tagged with an `accountId` so you can query resources specific to an account or query resources **across** accounts!

# Configuration

CloudGraph creates a configuration file at:

- UNIX: `~/.config/cloudgraph/.cloud-graphrc.json`
- Windows: `%LOCALAPPDATA%\cloudgraph/.cloud-graphrc.json`

NOTE: CloudGraph will output where it stores the configuration file and provider data as part of the `cg init` command

CloudGraph will generate this configuration file when you run `cg init aws`. You may update it manually or by running `cg init aws` again.

```
"aws": {
  "profileApprovedList": [
      "default",
      "master",
      "sandbox"
    ], // Optional, defaults to the default profile
    "regions": "us-east-1,us-east-2,us-west-2",
    "resources": "alb,apiGatewayResource,apiGatewayRestApi,apiGatewayStage,appSync,asg,billing,cognitoIdentityPool,cognitoUserPool,cloudFormationStack,cloudFormationStackSet,cloudfront,cloudwatch,ebs,ec2Instance,eip,elb,igw,kinesisFirehose,kinesisStream,kms,lambda,nat,networkInterface,route53HostedZone,route53Record,routeTable,sg,vpc,sqs,s3"
  }
}
```

CloudGraph AWS Provider will ask you what regions you would like to crawl and will by default crawl for **all** supported resources in **selected** regions in the **default** account. You can update the `regions`, `resources`, or `profile` fields in the `cloud-graphrc.json` file to change this behavior. You can also select which `resources` to crawl in the `cg init aws` command by passing the the `-r` flag: `cg init aws -r`

# Supported Services

| Service                     | Relations                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| alb                         | ec2, route53Record, securityGroup, subnet, vpc                                                                                                                                             |
| apiGatewayRestApi           | apiGatewayResource, apiGatewayStage, route53Record                                                                                                                                         |
| apiGatewayStage             | apiGatewayRestApi                                                                                                                                                                          |
| apiGatewayResource          | apiGatewayRestApi                                                                                                                                                                          |
| appSync                     | cognitoUserPool, dynamodb, lambda, rdsCluster                                                                                                                                              |
| asg                         | ebs, ec2, securityGroup, subnet                                                                                                                                                            |
| athenaDataCatalog                         |                                                                                                                                                         |
| clientVpnEndpoint           | securityGroup                                                                                                                                                                              |
| cloud9                      |                                                                                                                                                                                            |
| cloudformationStack         | cloudformationStack, iamRole, sns                                                                                                                                                          |
| cloudformationStackSet      |                                                                                                                                                                                            |
| cloudfront                  | elb, s3                                                                                                                                                                                    |
| cloudtrail                  | cloudwatch, cloudwatchLog, kms, s3, sns                                                                                                                                                                               |
| cloudwatch                  | cloudtrail, cloudwatchLog, sns                                                                                                                                                                                           |
| cloudwatchLog                  | cloudtrail, cloudwatch, kms                                                                                                                                                                                           |
| codebuild                   | iamRole, kms, vpc, securityGroup, subnet                                                                                                                                                                                           |
| cognitoIdentityPool         |                                                                                                                                                                                            |
| cognitoUserPool             | appSync, lambda                                                                                                                                                                            |
| configurationRecorder       | iamRole                                                                                                                               |
| customerGateway             | vpnConnection                                                                                                                                                                              |
| dynamodb                    | appSync, iamRole, kms                                                                                                                                                                                    |
| dmsReplicationInstance                         | securityGroup, subnet, vpc, kms                                                                                                                                      |
| ebs                         | asg, ec2, emrInstance                                                                                                                                                                      |
| ec2                         | alb, asg, ebs, eip, emrInstance, networkInterface, securityGroup, subnet, systemsManagerInstance, vpc, ecsContainer                                                                                                |
| ecr                         |                                                                                                                                                                                            |
| ecsCluster                  | ecsService, ecsTask, ecsTaskSet                                                                                                                                                            |
| ecsContainer                | ecsTask, ec2                                                                                                                                                                               |
| ecsService                  | ecsCluster, ecsTaskDefinition, ecsTaskSet, elb, iamRole, securityGroup, subnet, vpc                                                                                                        |
| ecsTask                     | ecsContainer, ecsCluster, ecsTaskDefinition                                                                                                                                                |
| ecsTaskDefinition           | ecsService, ecsTask, ecsTaskSet                                                                                                                                                            |
| ecsTaskSet                  | ecsCluster, ecsService, ecsTaskDefinition                                                                                                                                                  |
| efs                         | kms                                                                                                                                                                                        |
| efsMountTarget              | networkInterface, subnet, vpc                                                                                                                                                              |
| eip                         | ec2, networkInterface, vpc                                                                                                                                                                 |
| eksCluster                  | iamRole, kms, securityGroup, subnet, vpc                                                                                                                                                   |
| elastiCacheCluster          | securityGroup, subnet, vpc                                                                                                                                                                              |
| elastiCacheReplicationGroup | kms                                                                                                                                                                                        |
| elasticBeanstalkApp         | elasticBeanstalkEnv                                                                                                                                                                        |
| elasticBeanstalkEnv         | elasticBeanstalkApp                                                                                                                                                                        |
| elasticSearchDomain         | kms, securityGroup, subnet, vpc                                                                                                                                         |
| elb                         | cloudfront, ecsService, securityGroup, subnet, vpc                                                                                                                                         |
| emrCluster                  | kms, subnet                                                                                                                                                                                |
| emrInstance                 | ebs, ec2                                                                                                                                                                                   |
| emrStep                     |                                                                                                                                                                                            |
| flowLog                     | vpc, iamRole, subnet, networkInterface                                                                                                                                                     |
| glueJob                     | iamRole                                                                                                                                                   |
| glueRegistry                     |                                                                                                                                                  |
| guardDutyDetector                     | iamRole                                                                                                                                                  |
| iamInstanceProfile          | iamRole                                                                                                                                                      |
| iamPasswordPolicy           |                                                                                                                                                                                            |
| iamSamlProvider             |                                                                                                                                                                                            |
| iamOpenIdConnectProvider    |                                                                                                                                                                                            |
| iamServerCertificate        |                                                                                                                                                                                            |
| iamUser                     | iamGroup                                                                                                                                                                                   |
| iamPolicy                   | iamRole, iamGroup                                                                                                                                                                          |
| iamRole                     | codebuild, configurationRecorder, iamInstanceProfile, iamPolicy, eksCluster, ecsService, flowLog, glueJob, managedAirflow, sageMakerNotebookInstance, systemsManagerInstance guardDutyDetector                                                                                                                                                 |
| iamGroup                    | iamUser, iamPolicy                                                                                                                                                                         |
| igw                         | vpc                                                                                                                                                                                        |
| iot                         |                                                                                                                                                                                            |
| kinesisFirehose             | kinesisStream, s3                                                                                                                                                                          |
| kinesisStream               | kinesisFirehose                                                                                                                                                                            |
| kms                         | cloudtrail, cloudwatchLog, codebuild, dynamodb, efs, eksCluster, elastiCacheReplicationGroup, elasticSearchDomain, emrCluster, lambda, rdsClusterSnapshot, sns, sageMakerNotebookInstance, dmsReplicationInstance, redshiftCluster                                                             |
| lambda                      | appSync, cognitoUserPool, kms, securityGroup, subnet, vpc                                                                                                                                           |
| managedAirflow                      | iamRole, securityGroups, subnet, s3                                                                                                                                          |
| nacl                        | vpc                                                                                                                                                                                        |
| natGateway                  | networkInterface, subnet, vpc                                                                                                                                                              |
| networkInterface            | ec2, eip, efsMountTarget, natGateway, sageMakerNotebookInstance, subnet, vpc, flowLog                                                                                                                                 |
| organization                |  
| rdsCluster                  | appSync, rdsClusterSnapshot, rdsDbInstance, securityGroup                                                                                                                                                               |
| rdsClusterSnapshot                  | kms, rdsCluster, vpc                                                                                                                                                             |
| rdsDbInstance               | rdsCluster, securityGroup, vpc, subnet                                                                                                                                                     |
| redshiftCluster             | kms, vpc                                                                                                                                                                                   |
| route53Record               | alb, apiGatewayRestApi, elb, route53HostedZone                                                                                                                                             |
| route53HostedZone           | route53Record, vpc                                                                                                                                                                         |
| routeTable                  | subnet, transitGateway, transitGatewayAttachment,vpc                                                                                                                                       |
| sageMakerExperiment                          |                                                                                                                                                   |
| sageMakerNotebookInstance   | iamRole, kms, networkInterface, subnet, securityGroup                                                                                                                                                 |
| sageMakerProject                          |                                                                                                                                                  |
| s3                          | cloudfront, cloudtrail, kinesisFirehose, managedAirflow                                                                                                                                                   |
| secretsManager              |                                                                                                                                                                                            |
| securityGroup               | alb, asg, clientVpnEndpoint, codebuild, dmsReplicationInstance, ecsService, lambda, ec2, elasticSearchDomain, elb, rdsCluster, rdsDbInstance, eksCluster, elastiCacheCluster, managedAirflow, sageMakerNotebookInstance                                             |
| ses                         |                                                                                                                                                                                            |
| sns                         | kms, cloudtrail, cloudwatch                                                                                                                                                                            |
| sqs                         |                                                                                                                                                                                            |
| subnet                      | alb, asg, codebuild, dmsReplicationInstance, ec2, ecsService, efsMountTarget, elastiCacheCluster, elasticSearchDomain, elb, lambda, managedAirflow, natGateway, networkInterface, sageMakerNotebookInstance, routeTable, vpc, eksCluster, emrCluster, flowLog                                                     |
| systemsManagerInstance      | ec2, iamRole                                                                                                                                                                                           |
| systemsManagerDocument                         |                                                                                                                                                                                            |
| transitGateway              | routeTable, transitGatewayAttachment, vpnConnection                                                                                                                                                                                           |
| transitGatewayAttachment    | routeTable, transitGateway, vpc, vpnConnection                                                                                                                                                                            |
| vpc                         | alb, codebuild, dmsReplicationInstance, ec2, eip, elb, ecsService, efsMountTarget, eksCluster igw, elastiCacheCluster, elasticSearchDomain, lambda, nacl, natGateway, networkInterface, rdsClusterSnapshot, rdsDbInstance, redshiftCluster, route53HostedZone, routeTable, subnet, flowLog, vpnGateway, transitGatewayAttachment |
| vpnConnection               | customerGateway, transitGateway, transitGatewayAttachment, vpnGateway                                                                                                                                                                              |
| vpnGateway                  | vpc, vpnConnection                                                                                                                                                                                        |
| wafV2WebAcl                  |                                                                                                                                                                                        |

