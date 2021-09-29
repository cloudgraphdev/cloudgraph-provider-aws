# CloudGraph AWS Provider

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

| Service               | Relations                                                |
| ------------------    | -------------------------------------------------------- |
| alb                   | ec2, vpc                                                 |
| apiGatewayRestApi     | apiGatewaystage, apiGatewayResource                      |
| apiGatewayStage       | apiGatewayRestApi                                        |
| apiGatewayResource    | apiGatewayRestApi                                        |
| asg                   | ec2, securityGroups, ebs                                 |
| cloudformationStack   | cloudformationStack                                      |
| cloudformationStackSet|                                                          |
| cloudfront            | elb, s3                                                  |
| cloudwatch            |                                                          |
| cognitoIdentityPool   |                                                          |
| cognitoUserPool       | lambda                                                   |
| ebs                   | ec2, asg                                                 |
| ec2                   | alb, securityGroups, ebs, eip, networkInterface, asg     |
| eip                   | vpc, ec2, networkInterface                               |
| elb                   | securityGroups, vpc                                      |
| igw                   | vpc                                                      |
| kinesisFirehose       | kinesisStream, s3                                        |
| kinesisStream         |                                                          |
| kms                   | lambda                                                   |
| lambda                | vpc, kms, securityGroups                                 |
| natGateway            | networkInterface, vpc                                    |
| networkInterface      | ec2, natGateway, vpc, eip                                |
| s3                    |                                                          |
| securityGroup         | asg, lambda, ec2, elb                                    |
| sqs                   |                                                          |
| vpc                   | alb, eip, elb, igw, lambda, natGateway, networkInterface |
| route53HostedZone     | route53Record, vpc                                       |
| route53Record         | route53HostedZone, elb, alb                              |
| routeTable            | vpc                                                      |

<br />

# Query Examples

To use CloudGraph, you will need to be familiar with GraphQL. This section contains a handful of example queries to get you up and running but is by no means exhaustive. Feel free to make a PR with other examples you would like to see included, check out the [Contribution Guidelines](https://github.com/cloudgraphdev/cloudgraph-provider-aws/blob/master/CONTRIBUTING.md) section for more information.

<br />

## Basic AWS Query Syntax Examples:

To explain how CloudGraph works consider the following query that you can run to get the `ID` and `ARN` of a single `EC2 instance`. Note that for the purposes of these examples we will just request the `IDs` and `ARNs` of AWS resources to keep things terse, but you can query whatever attributes you want:

<br />

```graphql
query {
  getawsEc2(
    arn: "arn:aws:ec2:us-east-1:123445678997:instance/i-12345567889012234"
  ) {
    id
    arn
  }
}
```

<br />

This query will return a `JSON` payload that looks like this. All of the following examples will follow suit:

<br />

```json
{
  "data": {
    "getawsEc2": {
      "id": "i-12345567889012234",
      "arn": "arn:aws:ec2:us-east-1:123445678997:instance/i-12345567889012234"
    },
  },
  "extensions": {
    "touched_uids": 4
  }
}
```

<br />

Get the `ID` and `ARN` of each `EC2` in your entire AWS account:

```graphql
query {
  queryawsEc2 {
    id
    arn
  }
}
```

<br />

Get the `ID` and `ARN` of each `EC2` in `"us-east-1"` using a regex to search the `ARN`:

```graphql
query {
  queryawsEc2(filter: { arn: { regexp: "/.*us-east-1.*/" } }) {
    id
    arn
  }
}
```

<br />

Do the same thing but checking to see that the `region` is equal to `"us-east-1"` instead of using a regex:

```graphql
query {
  queryawsEc2(filter: { region: { eq: "us-east-1" } }) {
    id
    arn
  }
}
```

<br />

Do the same thing but checking to see that the `region` contains `"us-east-1"` in the name instead of using eq:

```graphql
query {
  queryawsEc2(filter: { region: { in: "us-east-1" } }) {
    id
    arn
  }
}
```

<br />

Get the `ID` and `ARN` of each `M5` series `EC2 instance` in `"us-east-1"`

```graphql
query {
  queryawsEc2(
    filter: { region: { eq: "us-east-1" }, instanceType: { regexp: "/^m5a*/" } }
  ) {
    id
    arn
  }
}
```

<br />

Do the same thing but skip the first found result (i.e. `offset: 1`) and then only return the first two results after that (i.e. `first: 2`) and order those results by AZ in ascending order (`order: { asc: availabilityZone }`) so that instance(s) in `"us-east-1a"` are returned at the top of the list.

```graphql
query {
  queryawsEc2(
    filter: { region: { eq: "us-east-1" }, instanceType: { regexp: "/^m5a*/" } }
    order: { asc: availabilityZone }
    first: 2
    offset: 1
  ) {
    id
    arn
  }
}
```

<br />

Do the same thing but also include the `EBS Volume` that is the boot disk for each `EC2 instance`:

```graphql
query {
  queryawsEc2(
    filter: { region: { eq: "us-east-1" }, instanceType: { regexp: "/^m5a*/" } }
    order: { asc: availabilityZone }
    first: 2
    offset: 1
  ) {
    id
    arn
    ebs(filter: { isBootDisk: true }, first: 1) {
      id
      arn
      isBootDisk
    }
  }
}
```

<br />

Do the same thing, but also include the `SGs` and `ALBs` for each `EC2`. For the `ALBs`, get the `EC2s` that they are connected to along with the `ID` and `ARN` of each found `EC2 instance` (i.e. a circular query).

```graphql
query {
  queryawsEc2(
    filter: { region: { eq: "us-east-1" }, instanceType: { regexp: "/^m5a*/" } }
    order: { asc: availabilityZone }
    first: 2
    offset: 1
  ) {
    id
    arn
    ebs(filter: { isBootDisk: true }, first: 1) {
      id
      arn
      isBootDisk
    }
    securityGroups {
      id
      arn
    }
    alb {
      id
      arn
      ec2Instance {
        id
        arn
      }
    }
  }
}
```

<br />

Get each `VPC`, the `ALBs` and `Lambdas` in that `VPC`, and then a bunch of nested sub-data as well. Also get each `S3 Bucket` in `us-east-1`. Also get the `SQS` queue with an `ARN` of `arn:aws:sqs:us-east-1:8499274828484:autocloud.fifo` and check the `approximateNumberOfMessages`. You get the idea, CloudGraph is **extremely** powerful.

```graphql
query {
  queryawsVpc {
	id
    arn
    alb {
      id
      arn
      ec2Instance{
        id
        arn
        ebs(filter: { isBootDisk: true }) {
          id
          arn
        }
      }
    }
    lambda {
      id
      arn
      kms {id
      arn}
    }
  }
  queryawsS3(filter: { region: { eq: "us-east-1" } }) {
    id
    arn
  }
  getawsSqs(arn: "arn:aws:sqs:us-east-1:8499274828484:autocloud.fifo") {
    approximateNumberOfMessages
  }
}
```

<br />

## AWS security, compliance, and governance examples:

<br />

Find all the unencrypted `EBS Volumes`:

```graphql
query {
  queryawsEbs(filter: { encrypted: false }) {
    id
    arn
    availabilityZone
    encrypted
  }
}
```

<br />

Find all the public `S3 Buckets`:

```graphql
query {
  queryawsS3(filter: { access: { eq: "Public" } }) {
    id
    arn
    access
  }
}
```

<br />

Find all the `S3 Buckets` that are themselves public or that can have Objects that are public in them:

```graphql
query {
  queryawsS3(filter: { not: { access: { eq: "Private" } } }) {
    id
    arn
    access
  }
}
```

<br />

Find all the `KMS` keys in `"us-east-1"`:

```graphql
query {
  queryawsKms(filter: { arn: { regexp: "/.*us-east-1.*/" } }) {
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

<br />

Find all the burstable `T` series instances:

```graphql
query {
  queryawsEc2(filter: { instanceType: { regexp: "/^t.*/" } }) {
    id
    arn
    availabilityZone
    instanceType
  }
}
```

<br />

Find the default `VPCs`:

```graphql
query {
  queryawsVpc(filter: { defaultVpc: true }) {
    id
    arn
    defaultVpc
    state
  }
}
```

<br />

Find the public `ALBs`:

```graphql
query {
  queryawsAlb(filter: { scheme: { eq: "internet-facing" } }) {
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

<br />

Find all of the `EC2s`, `Lambdas`, and `VPCs` that have a `Tag` value of `"Production"`:

```graphql
query {
  queryawsTag(filter: { value: { eq: "Production" } }) {
    key
    value
    ec2Instance {
      id
      arn
    }
    lambda {
      id
      arn
    }
    vpc {
      id
      arn
    }
  }
}
```

<br />

Do the same thing but look for both a `key` and a `value`:

```graphql
query {
  queryawsTag(
    filter: {  key: { eq: "Environment" }, value: { eq: "Production" } }
  ) {
    key
    value
    ec2Instance {
      id
      arn
    }
    lambda {
      id
      arn
    }
    vpc {
      id
      arn
    }
  }
}
```

<br />

Do the same thing using `getawsTag` instead of `queryawsTag`. Note that when searching for tags using `getawsTag` your must specify **both** the `key` and `value` as the `id` like is done below with `"Environment:Production"`:

```graphql
query {
  getawsTag(id: "Environment:Production") {
    key
    value
    ec2Instance {
      id
      arn
    }
    lambda {
      id
      arn
    }
    vpc {
      id
      arn
    }
  }
}
```

<br />

## AWS FinOps examples:
<br />

Note that in order to successfully ingest FinOps related data you must have the Cost Explorer API enabled in your AWS Account. [You can view how to do that here](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/ce-access.html)

<br />

Get the `total cost` of your AWS Account for the `last 30 days`, the `total cost` of your AWS Account `month to date`, a breakdown of `each service and its cost for the last 30 days`, and a breakdown of `each service and its cost month to date` as well as the `monthly` and `month to date` average costs:

```graphql
query {
  queryawsBilling {
    totalCostLast30Days {
      cost
      currency
      formattedCost
    }
    totalCostMonthToDate {
      cost
      currency
      formattedCost
    }
    monthToDate {
      name
      cost
      currency
      formattedCost
    }
    last30Days {
      name
      cost
      currency
      formattedCost
    }
    monthToDateDailyAverage {
      name
      cost
      currency
      formattedCost
    }
    last30DaysDailyAverage {
      name
      cost
      currency
      formattedCost
    }
  }
}
```

<br />

This query will return a `JSON` payload that looks like this:

```json
{
  "data": {
    "queryawsBilling": [
      {
        "totalCostLast30Days": {
          "cost": 7088.87,
          "currency": "USD",
          "formattedCost": "$7088.87"
        },
        "totalCostMonthToDate": {
          "cost": 7089.28,
          "currency": "USD",
          "formattedCost": "$7089.28"

        },
        "monthToDate": [
          {
            "name": "Amazon Relational Database Service",
            "cost": 548.68,
            "currency": "USD",
            "formattedCost": "$548.68"
          },
          {
            "name": "Amazon Managed Streaming for Apache Kafka",
            "cost": 67.49,
            "currency": "USD",
            "formattedCost": "$67.49"
          },
          {
            "name": "Amazon OpenSearch Service",
            "cost": 1155.04,
            "currency": "USD",
            "formattedCost": "$1155.04"
          }
          ...More Services
        ],
        "last30Days": [
          {
            "name": "AWS Step Functions",
            "cost": 330.20,
            "currency": "USD",
            "formattedCost": "$330.20"
          },
          {
            "name": "Amazon Elastic Container Service for Kubernetes",
            "cost": 194.40,
            "currency": "USD",
            "formattedCost": "$194.40"
          },
          {
            "name": "AmazonCloudWatch",
            "cost": 310.54,
            "currency": "USD",
            "formattedCost": "$310.54"
          }
          ...More Services
        ],
        "monthToDateDailyAverage": [
          {
            "name": "Amazon Relational Database Service",
            "cost": 54.86,
            "currency": "USD",
            "formattedCost": "$54.86"
          },
          {
            "name": "Amazon Managed Streaming for Apache Kafka",
            "cost": 6.74,
            "currency": "USD",
            "formattedCost": "$6.74"
          },
          {
            "name": "Amazon OpenSearch Service",
            "cost": 115.50,
            "currency": "USD",
            "formattedCost": "$115.50"
          }
          ...More Services
        ],
        "last30DaysDailyAverage": [
          {
            "name": "AWS Step Functions",
            "cost": 33.01,
            "currency": "USD",
            "formattedCost": "$33.01"
          },
          {
            "name": "Amazon Elastic Container Service for Kubernetes",
            "cost": 19.44,
            "currency": "USD",
            "formattedCost": "$19.44"
          },
          {
            "name": "AmazonCloudWatch",
            "cost": 31.05,
            "currency": "USD",
            "formattedCost": "$31.05"
          }
          ...More Services
        ],
      }
    ]
  },
  "extensions": {
    "touched_uids": 212
  }
}
```

<br />

Get each `EC2 instance` in your AWS account along with its daily cost:

```graphql
query {
  queryawsEc2 {
    arn
    dailyCost
    currency
    formattedDailyCost
  }
}
```

<br />

This query will return a `JSON` payload that looks like this. All of the following examples will follow suit:

```json
{
  "data": {
  "queryawsEc2": [
    {
      "arn": "arn:aws:ec2:us-east-1:111122222333:instance/i-03jdfgakfg9999fgf",
      "dailyCost": 2.06,
      "currency": "USD",
      "formattedDailyCost": "$2.06"
    },
    {
      "arn": "arn:aws:ec2:us-east-1:111122222333:instance/i-jifgfd0df0gdf8fd88",
      "dailyCost": 34.11,
      "currency": "USD",
      "formattedDailyCost": "$34.11"
    }
    ...More EC2 Instances
  ],
  "extensions": {
    "touched_uids": 212
  }
}
```

<br />

Get each `NAT Gateway` in your AWS account along with its daily cost:

```graphql
query {
  queryawsNatGateway {
    arn
    currency
    dailyCost
    formattedDailyCost
  }
}
```

<br />

## Thinking in terms of a graph:

<br />

When you think, "in terms of a graph", you can do almost anything with CloudGraph. Say for example that you want to know what Lamba functions don't belong to a VPC (i.e. they don't leverage VPC networking). Because CloudGraph connects all resources that have relationships, such as VPC parents to their Lambda children, you are able to answer this question easily. Simply check to see what lambda functions the VPC is "connected" to, and compare that against the list of all lambda functions like so:


```graphql
query {
  queryawsVpc{
    id
    arn
    lambda {
      id
      arn
    }
  }
  queryawsLambda {
    id
    arn
  }
}
```

<br />

## Limitations

<br />

Today, the biggest limitation with CloudGraph and our query abilities is we don't support nested filtering based on child attributes. So for example, as cool as it would be to do the following, it's just not possible yet:

<br />

```graphql
query {
  queryawsEc2(filter: { ebs: { isBootDisk: true } }) {
    id
    arn
    ebs {
      id
      arn
    }
  }
}
```

This is actually not a limitation of CloudGraph, but rather a feature that still needs to be implemented with Dgraph. [You can view and comment on the discussion thread here](https://discuss.dgraph.io/t/proposal-nested-object-filters-for-graphql-rewritten-as-var-blocks-in-dql/12252/2)
