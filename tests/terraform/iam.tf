# IAM Global

resource "aws_iam_account_password_policy" "strict" {
  max_password_age               = 60
  minimum_password_length        = 8
  password_reuse_prevention      = 2
  require_lowercase_characters   = true
  require_numbers                = true
  require_uppercase_characters   = true
  require_symbols                = true
  allow_users_to_change_password = true
}

resource "aws_iam_server_certificate" "test_cert_alt" {
  name = "alt_test_cert"

  certificate_body = <<EOF
-----BEGIN CERTIFICATE-----
[......] # cert contents
-----END CERTIFICATE-----
EOF

  private_key = <<EOF
-----BEGIN RSA PRIVATE KEY-----
[......] # cert contents
-----END RSA PRIVATE KEY-----
EOF
}

resource "aws_iam_openid_connect_provider" "default" {
  url = "https://accounts.google.com"

  client_id_list = [
    "266362248691-342342xasdasdasda-apps.googleusercontent.com",
  ]

  thumbprint_list = []
}

resource "aws_iam_saml_provider" "default" {
  name                   = "myprovider"
  saml_metadata_document = file("saml-metadata.xml")
}

# IAM Group

resource "aws_iam_group" "read_only_access" {
  name = "ReadOnlyAccess"
  path = "/"
}

resource "aws_iam_group" "administrators" {
  name = "Administrators"
  path = "/"
}

# IAM Role

resource "aws_iam_role" "test_role" {
  name = "test_role"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    tag-key = "tag-value"
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

resource "aws_iam_role" "AWSCloudFormationStackSetAdministrationRole" {
  assume_role_policy = data.aws_iam_policy_document.AWSCloudFormationStackSetAdministrationRole_assume_role_policy.json
  name               = "AWSCloudFormationStackSetAdministrationRole"
}

# IAM User

resource "aws_iam_user" "autocloud_user" {
  name = "autocloud"
  path = "/"

  tags = {
    tag-key = "tag-value"
  }
}

resource "aws_iam_access_key" "autocloud_key" {
  user = aws_iam_user.autocloud_user.name
}

resource "aws_iam_user_policy" "autocloud_policy" {
  name = "test"
  user = aws_iam_user.autocloud_user.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ec2:Describe*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_user_group_membership" "read_only_membership" {
  user = aws_iam_user.autocloud_user.name

  groups = [
    aws_iam_group.read_only_access.name,
  ]
}

# IAM Policy

resource "aws_iam_policy_attachment" "test-attach" {
  name       = "test-attachment"
  users      = []
  roles      = [aws_iam_role.test_role.name]
  groups     = [aws_iam_group.read_only_access.name]
  policy_arn = aws_iam_policy.replication.arn
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

resource "aws_iam_role" "r" {
  name = "my-awsconfig-role"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "config.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy" "p" {
  name = "my-awsconfig-policy"
  role = aws_iam_role.r.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Action": "config:Put*",
          "Effect": "Allow",
          "Resource": "*"

      }
  ]
}
POLICY
}