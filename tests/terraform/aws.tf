provider "aws" {
  access_key                  = "test"
  region                      = "us-east-1"
  s3_force_path_style         = true
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    apigateway     = "http://localhost:4566"
    autoscaling    = "http://localhost:4566"
    cloud9         = "http://localhost:4566"
    cloudformation = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
    cloudwatchlogs = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    ec2            = "http://localhost:4566"
    ecs            = "http://localhost:4566"
    efs            = "http://localhost:4566"
    es             = "http://localhost:4566"
    firehose       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    iot            = "http://localhost:4566"
    kinesis        = "http://localhost:4566"
    kms            = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    redshift       = "http://localhost:4566"
    route53        = "http://localhost:4566"
    s3             = "http://localhost:4566"
    secretsmanager = "http://localhost:4566"
    ses            = "http://localhost:4566"
    sns            = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    ssm            = "http://localhost:4566"
    stepfunctions  = "http://localhost:4566"
    sts            = "http://localhost:4566"
  }
}


resource "aws_route53_zone" "zone" {
  name = "cloudgraph.com"
}

resource "aws_route53_zone" "dev" {
  name = "dev.cloudgraph.com"
}

resource "aws_route53_record" "record" {
  name    = "private.cloudgraph.com"
  ttl     = 30
  type    = "NS"
  zone_id = aws_route53_zone.zone.zone_id

  records = aws_route53_zone.dev.name_servers
}
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.zone.zone_id
  name    = "www.cloudgraph.com"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.eip.public_ip]
}

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags       = { Key = "vpc", Value = "example" }
}

resource "aws_instance" "instance" {
  ami           = "ami-005e54dee72cc1d00" # us-west-2
  instance_type = "t2.micro"

  credit_specification {
    cpu_credits = "unlimited"
  }

  depends_on = [aws_network_interface.network_interface]
}

resource "aws_network_interface_sg_attachment" "sg_attachment" {
  security_group_id    = aws_security_group.sg.id
  network_interface_id = aws_instance.instance.primary_network_interface_id
}

resource "aws_security_group" "sg" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    description = "TLS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
  }

  tags = {
    Name = "allow_tls"
  }

  depends_on = [aws_vpc.vpc]
}

resource "aws_sns_topic" "sns_topic" {
  name = "user-updates-topic"
}

resource "aws_cloudwatch_metric_alarm" "metric_alarm" {
  alarm_name                = "CPU Utilization"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = "4"
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = "60"
  statistic                 = "Average"
  threshold                 = "40"
  alarm_description         = "CPU Utilization with 40% as threshold"
  insufficient_data_actions = []
  datapoints_to_alarm       = "3"
  alarm_actions             = [aws_sns_topic.sns_topic.arn]
  dimensions = {
    InstanceId = "i-1234567890abcdef0"
  }
  tags = { Key = "testTag", Value = "TestValue" }

  depends_on = [aws_sns_topic.sns_topic]
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "subnet" {
  availability_zone = data.aws_availability_zones.available.names[0]
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.1.0/24"

  tags = {
    Name = "Main"
  }

  depends_on = [aws_vpc.vpc]
}

resource "aws_network_interface" "network_interface" {
  subnet_id       = aws_subnet.subnet.id
  private_ips     = ["10.0.0.50"]
  security_groups = [aws_security_group.sg.id]

  depends_on = [aws_security_group.sg, aws_subnet.subnet]
}

resource "aws_eip" "eip" {
  instance = aws_instance.instance.id
  vpc      = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "Main"
  }

  depends_on = [aws_vpc.vpc]
}

resource "aws_kms_key" "lambda_kms_key" {
  description             = "KMS key 1"
  deletion_window_in_days = 10

  tags = {
    Name = "Main"
  }
}

resource "aws_api_gateway_rest_api" "example" {
  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "example"
      version = "1.0"
    }
    paths = {
      "/path1" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "GET"
            payloadFormatVersion = "1.0"
            type                 = "HTTP_PROXY"
            uri                  = "https://ip-ranges.amazonaws.com/ip-ranges.json"
          }
        }
      }
    }
  })

  name        = "api_gateway_rest_api"
  description = "example description"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  minimum_compression_size = -1

  tags = { Name = "api_gateway_rest_api" }
}

resource "aws_api_gateway_deployment" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.example.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_role" "lambda_iam_role" {
  name = "lambda_iam_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "lambda_function_name"
  role          = aws_iam_role.lambda_iam_role.arn
  package_type  = "Image"
  image_uri     = "lambda/alpine"
  kms_key_arn   = aws_kms_key.lambda_kms_key.arn

  vpc_config {
    subnet_ids         = [aws_subnet.subnet.id]
    security_group_ids = [aws_security_group.sg.id]
  }
}

resource "aws_cloudwatch_log_group" "yada" {
  name = "yada"
}

resource "aws_api_gateway_client_certificate" "demo" {
  description = "client certificate"
}

resource "aws_api_gateway_stage" "api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.example.id
  rest_api_id   = aws_api_gateway_rest_api.example.id
  stage_name    = "example"
  description   = "Example stage"
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.yada.id
    format          = "CSV"
  }
  cache_cluster_enabled = true
  cache_cluster_size    = 0.5
  client_certificate_id = aws_api_gateway_client_certificate.demo.id
  documentation_version = "0.0.1"
  xray_tracing_enabled  = true
}

resource "aws_api_gateway_resource" "exampleResource" {
  rest_api_id = aws_api_gateway_rest_api.example.id
  parent_id   = aws_api_gateway_rest_api.example.root_resource_id
  path_part   = "exampleresource"
}

resource "aws_api_gateway_method" "any" {
  rest_api_id   = aws_api_gateway_rest_api.example.id
  resource_id   = aws_api_gateway_resource.exampleResource.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_rest_api_policy" "api_gateway_rest_api_policy" {
  rest_api_id = aws_api_gateway_rest_api.example.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "execute-api:Invoke",
      "Resource": "${aws_api_gateway_rest_api.example.execution_arn}",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "123.123.123.123/32"
        }
      }
    }
  ]
}
EOF
}

resource "aws_ebs_volume" "ebs_volume" {
  availability_zone = "us-east-1a"
  size              = 40

  tags = {
    Name = "HelloWorld"
  }
}

resource "aws_volume_attachment" "ebs_att" {
  device_name = "/dev/sdh"
  volume_id   = aws_ebs_volume.ebs_volume.id
  instance_id = aws_instance.instance.id
}

# NAT GW SG
resource "aws_security_group" "natgw" {
  name        = "natgwSecurityGroup"
  description = "natgwSecurityGroup"
  vpc_id      = aws_vpc.vpc.id
  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }
  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
  tags = {
    "Name" = "natgwSecurityGroup"
  }

  depends_on = [aws_vpc.vpc]
}

resource "aws_subnet" "nat_gateway" {
  availability_zone = data.aws_availability_zones.available.names[0]
  cidr_block        = "10.0.2.0/24"
  vpc_id            = aws_vpc.vpc.id
  tags = {
    "Name" = "DummySubnetNAT"
  }
  depends_on = [aws_vpc.vpc]
}

resource "aws_internet_gateway" "nat_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    "Name" = "DummyGateway"
  }

  depends_on = [aws_vpc.vpc]
}

resource "aws_eip" "nat_gateway" {
  vpc = true
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_gateway.id
  subnet_id     = aws_subnet.nat_gateway.id
  tags = {
    "Name" = "DummyNatGateway"
  }

  depends_on = [aws_subnet.nat_gateway, aws_eip.nat_gateway]
}

# resource "aws_route_table" "nat_gateway" {
#   vpc_id = aws_vpc.vpc.id
#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.nat_gateway.id
#   }
# }

# resource "aws_route_table_association" "nat_gateway" {
#   subnet_id = aws_subnet.nat_gateway.id
#   route_table_id = aws_route_table.nat_gateway.id
# }

resource "aws_kinesis_stream" "kinesis" {
  name             = "cloudgraph-kinesis"
  shard_count      = 1
  retention_period = 48

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]

  tags = {
    Environment = "test"
  }
}

resource "aws_sqs_queue_policy" "policy" {
  queue_url = aws_sqs_queue.cloudgraph_queue.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Id": "sqspolicy",
  "Statement": [
    {
      "Sid": "First",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${aws_sqs_queue.cloudgraph_queue.arn}"
    }
  ]
}
POLICY
}

resource "aws_sqs_queue" "cloudgraph_queue" {
  name                      = "cloudgraph-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  tags = {
    Environment = "test"
  }
}

resource "aws_s3_bucket" "source" {
  bucket = "cloudgraph-bucket-source"
  acl    = "public-read"


  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = aws_kms_key.lambda_kms_key.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }

  replication_configuration {
    role = aws_iam_role.lambda_iam_role.arn

    rules {
      id     = "foobar"
      prefix = "foo"
      status = "Enabled"

      destination {
        bucket        = aws_s3_bucket.destination.arn
        storage_class = "STANDARD"
      }
    }
  }

  lifecycle_rule {
    id      = "log"
    enabled = true

    prefix = "log/"

    tags = {
      rule      = "log"
      autoclean = "true"
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA" # or "ONEZONE_IA"
    }

    transition {
      days          = 60
      storage_class = "GLACIER"
    }

    expiration {
      days = 90
    }
  }

  tags = {
    Name        = "Cloudgraph Source"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket" "destination" {
  bucket = "cloudgraph-bucket-destination"

  tags = {
    Name        = "Cloudgraph Destination"
    Environment = "Dev"
  }
}

resource "aws_iam_policy" "replication" {
  name = "cloudgraph-policy-replication"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetReplicationConfiguration",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.source.arn}"
      ]
    },
    {
      "Action": [
        "s3:GetObjectVersionForReplication",
        "s3:GetObjectVersionAcl",
         "s3:GetObjectVersionTagging"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_s3_bucket.source.arn}/*"
      ]
    },
    {
      "Action": [
        "s3:ReplicateObject",
        "s3:ReplicateDelete",
        "s3:ReplicateTags"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.destination.arn}/*"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "replication" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = aws_iam_policy.replication.arn
}

resource "aws_kinesis_firehose_delivery_stream" "extended_s3_stream" {
  name        = "terraform-kinesis-firehose-extended-s3-test-stream"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn =  aws_kinesis_stream.kinesis.arn
    role_arn = aws_iam_role.kinesis_role.arn
  }

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.bucket.arn
  }
}

resource "aws_s3_bucket" "bucket" {
  bucket = "tf-test-bucket"
  acl    = "public-read"
}

resource "aws_iam_role" "kinesis_role" {
  name = "kinesis_test_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "kinesis.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "firehose_role" {
  name = "firehose_test_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "firehose.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_s3_bucket_object" "cf-template" {
  bucket = aws_s3_bucket.destination.bucket
  key    = "EC2ChooseAMI.template"
  source = "./EC2ChooseAMI.template"
}

resource "aws_cloudformation_stack" "cg-cloudformation-stack-test" {
  name = "cg-cloudformation-stack-test"

  parameters = {
    VPCCidr = "10.0.0.0/16"
  }

  template_body = <<STACK
{
  "Parameters" : {
    "VPCCidr" : {
      "Type" : "String",
      "Default" : "10.0.0.0/16",
      "Description" : "Enter the CIDR block for the VPC. Default is 10.0.0.0/16."
    }
  },
  "Resources" : {
    "myVpc": {
      "Type" : "AWS::EC2::VPC",
      "Properties" : {
        "CidrBlock" : { "Ref" : "VPCCidr" },
        "Tags" : [
          {"Key": "Name", "Value": "Primary_CF_VPC"}
        ]
      }
    },
    "NestedStack" : {
      "Type" : "AWS::CloudFormation::Stack",
      "Properties" : {
      "TemplateURL" : "https://${aws_s3_bucket.destination.bucket_domain_name}/${aws_s3_bucket_object.cf-template.key}",
      "Parameters" : {
        "InstanceType" : "t1.micro",
        "KeyName" : "nestedStack1"
      }
      }
    }
  }
}
STACK
}

data "aws_iam_policy_document" "AWSCloudFormationStackSetAdministrationRole_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      identifiers = ["cloudformation.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_iam_role" "AWSCloudFormationStackSetAdministrationRole" {
  assume_role_policy = data.aws_iam_policy_document.AWSCloudFormationStackSetAdministrationRole_assume_role_policy.json
  name               = "AWSCloudFormationStackSetAdministrationRole"
}

resource "aws_cloudformation_stack_set" "cg-cloudformation-stack-set-test" {
  administration_role_arn = aws_iam_role.AWSCloudFormationStackSetAdministrationRole.arn
  name                    = "cg-cloudformation-stack-set-test"

  parameters = {
    VPCCidr = "10.0.0.0/16"
  }
}

data "aws_iam_policy_document" "AWSCloudFormationStackSetAdministrationRole_ExecutionPolicy" {
  statement {
    actions   = ["sts:AssumeRole"]
    effect    = "Allow"
    resources = ["arn:aws:iam::*:role/${aws_cloudformation_stack_set.cg-cloudformation-stack-set-test.execution_role_name}"]
  }
}

resource "aws_iam_role_policy" "AWSCloudFormationStackSetAdministrationRole_ExecutionPolicy" {
  name   = "ExecutionPolicy"
  policy = data.aws_iam_policy_document.AWSCloudFormationStackSetAdministrationRole_ExecutionPolicy.json
  role   = aws_iam_role.AWSCloudFormationStackSetAdministrationRole.name
}

resource "aws_dynamodb_table" "test-table" {
  name           = "test-table"
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "testHashKey"
  range_key      = "anotherKey"

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  ttl {
    attribute_name = "TimeToExist"
    enabled        = true
  }

  server_side_encryption {
    enabled = true
  }

  point_in_time_recovery {
    enabled = false
  }

  attribute {
    name = "testHashKey"
    type = "S"
  }

  attribute {
    name = "anotherKey"
    type = "S"
  }

  attribute {
    name = "yetAnotherKey"
    type = "S"
  }


  local_secondary_index {
    name            = "lsi-testHashKey-anotherKey"
    range_key       = "anotherKey"
    projection_type = "ALL"
  }

  global_secondary_index {
    name               = "gsi-yetAnotherKey"
    hash_key           = "testHashKey"
    range_key          = "yetAnotherKey"
    write_capacity     = 1
    read_capacity      = 1
    projection_type    = "ALL"
  }


  tags = {
    Name        = "test-table-test-env"
    Environment = "test-env"
  }
}

resource "aws_network_acl" "cg-test-nacl" {
  vpc_id = aws_vpc.vpc.id
  subnet_ids = [aws_subnet.subnet.id]

  egress = [
    {
      protocol   = "tcp"
      rule_no    = 200
      action     = "allow"
      cidr_block = "10.3.0.0/18"
      from_port  = 443
      to_port    = 443
      icmp_code  = 0
      icmp_type  = 0
      ipv6_cidr_block = ""
    }
  ]

  ingress = [
    {
      protocol   = "tcp"
      rule_no    = 100
      action     = "allow"
      cidr_block = "10.3.0.0/18"
      from_port  = 80
      to_port    = 80
      icmp_code  = 0
      icmp_type  = 0
      ipv6_cidr_block = ""
    }
  ]

  tags = {
    Name = "cg-test-nacl"
  }
}