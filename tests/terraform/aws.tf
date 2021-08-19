provider "aws" {
  access_key                  = "mock_access_key"
  region                      = "us-east-1"
  s3_force_path_style         = true
  secret_key                  = "mock_secret_key"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    ec2            = "http://localhost:4566"
    ecs            = "http://localhost:4566"
    efs            = "http://localhost:4566"
    kms            = "http://localhost:4566"
    apigateway     = "http://localhost:4566"
    cloudformation = "http://localhost:4566"
    cloudwatch     = "http://localhost:4566"
    dynamodb       = "http://localhost:4566"
    es             = "http://localhost:4566"
    firehose       = "http://localhost:4566"
    iam            = "http://localhost:4566"
    kinesis        = "http://localhost:4566"
    lambda         = "http://localhost:4566"
    route53        = "http://localhost:4566"
    redshift       = "http://localhost:4566"
    s3             = "http://localhost:4566"
    secretsmanager = "http://localhost:4566"
    ses            = "http://localhost:4566"
    sns            = "http://localhost:4566"
    sqs            = "http://localhost:4566"
    ssm            = "http://localhost:4566"
    stepfunctions  = "http://localhost:4566"
    sts            = "http://localhost:4566"
    iot            = "http://localhost:4566"
    cloud9         = "http://localhost:4566"
    autoscaling    = "http://localhost:4566"
  }
}

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  tags       =  { Key = "vpc", Value = "example" }
}

resource "aws_instance" "instance" {
  ami           = "ami-005e54dee72cc1d00" # us-west-2
  instance_type = "t2.micro"

  credit_specification {
    cpu_credits = "unlimited"
  }
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
    description      = "TLS from VPC"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
  }

  tags = {
    Name = "allow_tls"
  }
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
  tags                      = { Key = "testTag", Value = "TestValue" }
}

resource "aws_subnet" "subnet" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "Main"
  }
}

resource "aws_eip" "eip" {
  instance = aws_instance.instance.id
  vpc      = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "main"
  }
}

resource "aws_kms_key" "lambda_kms_key" {
  description             = "KMS key 1"
  deletion_window_in_days = 10

  tags = {
    Name = "Main"
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
