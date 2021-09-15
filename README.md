CloudGraph AWS Provider
===========

Use the CloudGraph AWS Provider to scan and normalize cloud infrastructure using the [AWS SDK ](https://github.com/aws/aws-sdk-js)

<!-- toc -->
- [Install](#install)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Supported Services](#supported-services)
- [Query Examples](#query-examples)
<!-- tocstop -->

# Install

Install the aws provider in CloudGraph
```
cg init aws
```

# Authentication

Authenticate the CloudGraph AWS Provider any of the following ways:
- Credentials from env variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`
- Credentials found in the `credentials` under `~/.aws` (any profile, defaults to `default`)
- RoleArn found in CloudGraph's `cloud-graphrc.json` file under `aws.role` (TODO: Update this once multiple accounts flow is done)
# Configuration

CloudGraph creates a configuration file at:
- UNIX: `~/.config/cloudgraph/.cloud-graphrc.json`
- Windows: `%LOCALAPPDATA%\cloudgraph/.cloud-graphrc.json`

NOTE: CloudGraph will output where it stores the configuration file and provider data as part of the `cg init` command

CloudGraph will generate this configuration file when you run `cg init aws`. You may update it manually or by running `cg init aws` again.

```
"aws": {
  "profile": "myTestEnv", // optional: defaults to the default profile
  "regions": "us-east-1,us-east-2,us-west-1,us-west-2",
  "resources": "alb,apiGatewayResource,apiGatewayRestApi,apiGatewayStage,cloudwatch,ebs,ec2Instance,eip,elb,igw,kms,lambda,nat,networkInterface,sg,vpc,sqs"
}
```

CloudGraph AWS Provider will ask you what regions you would like to crawl and will by default crawl for **all** supported resources in **selected** regions in the **default** account. You can update the `regions`, `resources`, or `profile` fields in the `cloud-graphrc.json` file to change this behavior. You can also select which `resources` to crawl in the `cg init aws` command by passing the the `-r` flag: `cg init aws -r`

# Supported Services

| Service            | Relations                                                |
|--------------------|----------------------------------------------------------|
| alb                | ec2, vpc                                                 |
| apiGatewayRestApi  | apiGatewaystage, apiGatewayResource                      |
| apiGatewayStage    | apiGatewayRestApi                                        |
| apiGatewayResource | apiGatewayRestApi                                        |
| asg                | ec2, securityGroups, ebs                                 |
| cloudwatch         |                                                          |
| ebs                | ec2, asg                                                 |
| ec2                | alb, securityGroups, ebs, eip, networkInterface, asg     |
| eip                | vpc, ec2, networkInterface                               |
| elb                | securityGroups, vpc                                      |
| igw                | vpc                                                      |
| kinesisStream      |                                                          |
| kms                | lambda                                                   |
| lambda             | vpc, kms, securityGroups                                 |
| natGateway         | networkInterface, vpc                                    |
| networkInterface   | ec2, natGateway, vpc, eip                                |
| securityGroup      | asg, lambda, ec2, elb                                    |
| sqs                |                                                          |
| vpc                | alb, eip, elb, igw, lambda, natGateway, networkInterface |

# Query Examples

Find Unencrypted EBS Volumes.

```
query {
  queryawsEbs(filter: { encrypted: false }) {
    id,
    arn,
    availabilityZone,
    encrypted
  }
}
```

Find KMS Keys in region us-east-1

```
query {
  queryawsKms(filter: {arn: { regexp: "/.*us-east-1.*/" } }) {
    id
		arn
    description
    enableKeyRotation
    tags {
      key
      value
    }
  }
}
```

Find public ALBs

```
query {
  queryawsAlb (filter: { scheme: { eq: "internet-facing" } } ) {
    id
    arn
  	dnsName
    createdAt
    tags {
      key
      value
    }
  }
}
```

Find default VPC

```
query {
  queryawsVpc( filter: { defaultVpc: true } ) {
    id
    arn
    defaultVpc
    state
  }
}
```