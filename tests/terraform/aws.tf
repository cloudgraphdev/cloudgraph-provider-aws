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
