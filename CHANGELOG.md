## [0.41.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.41.1...0.41.2) (2021-11-08)


### Bug Fixes

* **cloudtrail:** add/generate cgId as id ([c812892](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c8128922fae15c22d173b42c2302d28460bfe9e5))
* **cloudtrail:** fix cloudtrail ids ([596db76](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/596db76edc7939b891de80e1824d40a9374b7c6a))
* **cloudtrail:** generate unique id, drop cgId ([db32ce8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/db32ce8ac97c3fa017b1c731f615000ccdeb1c19))

## [0.41.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.41.0...0.41.1) (2021-11-05)


### Bug Fixes

* Set aws credentials when they are input by the user ([8db4631](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8db46315446fb8f7261db1b2d4f7664fc0e053cd))

# [0.41.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.5...0.41.0) (2021-11-04)


### Bug Fixes

* **sqs:** fix sqs tags formatting issue, update try/catch to not drop services if an error is hit ([33f1852](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/33f1852b27eac0d870a3b4b789560ec3b02a3c9a))


### Features

* **eks:** add eks cluster service ([2e29304](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2e293048268f8b86e4e2064237c5bfe48303f5dc))

## [0.40.5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.4...0.40.5) (2021-11-03)


### Bug Fixes

* Use safe accessor to cloudfront-elb connections ([92bde75](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/92bde756d18e69e2efadba290f0b93e1322ffe36))

## [0.40.4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.3...0.40.4) (2021-11-03)


### Bug Fixes

* use cuids instead of arns to identify globalSecondaryIndexes ([e889ae6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e889ae687a219cb10190c993f795ae54e253393a))

## [0.40.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.2...0.40.3) (2021-11-03)


### Bug Fixes

* Added status and createDate fields to iamUser access key ([529c5f8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/529c5f864fb1bbf1793dd240cc552cc4834bb979))

## [0.40.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.1...0.40.2) (2021-11-03)


### Bug Fixes

* **elasticBeanstalk:** update to match vsdapi changes ([8ec08e0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8ec08e08209bba87218c2abda2fde20a60857c19))

## [0.40.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.40.0...0.40.1) (2021-11-01)


### Bug Fixes

* **redshift:** fix connections and add tag connection to redshift ([88298d1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/88298d145b6e96d86789376cde28fd1cfdadc9f9))

# [0.40.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.39.2...0.40.0) (2021-10-28)


### Bug Fixes

* **sns:** add cgId, use bucket/kms arn in connection ([6148536](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/61485360afa06fbb2e1be7b2b6dabbdd4a44d66f))
* **sns:** add cloudtrail/kms connections, schema updates ([8a46afe](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8a46afe40efb036f6eaf3e4d8cf32391010d8f17))
* **sns:** cleanup ([ec459fa](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ec459fa8de9ba3cbdf14fe7b2bc1262686f5becf))


### Features

* **sns:** add sns service ([c268e98](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c268e9897409fb843229674e1465de75228adbbb))

## [0.39.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.39.1...0.39.2) (2021-10-28)


### Bug Fixes

* **iamPolicies:** change scope to get user managed and attached aws policies ([28b6bdc](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/28b6bdcf71c572adfe9df0f021be9686ce9babd8))

## [0.39.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.39.0...0.39.1) (2021-10-28)


### Bug Fixes

* **apiGateway:** share data between apiGw parent and children services ([a9186c4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a9186c4d4b1db708ffe7d093ecdc971462c4c9f5))

# [0.39.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.38.2...0.39.0) (2021-10-27)


### Bug Fixes

* **redshift:** use arn in connections key ([5eb33b2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5eb33b20f78d72bcaf9143398f8de0b84c84e1d7))
* **redshift:** use vpc type in connections ([297cc03](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/297cc0355ff368afbbef0363088c4fb7774bc5ba))


### Features

* **redshift:** add redshift service ([312f105](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/312f105e65e8e4e458bc196501e6411f755b7f30))

## [0.38.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.38.1...0.38.2) (2021-10-27)


### Bug Fixes

* **config:** update getting aws config for default creds ([6dbdbb5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6dbdbb572850ceba2df0ceda7f7a24f166e314dc))
* **getData:** fix connections merging to ensure we dont drop connections ([b2a6dc9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b2a6dc905295942bf30994b5fb0e44d42d2fde65))
* **getData:** update getting raw data to use merged raw data for connections ([dc88000](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/dc88000a077993616e53fc5e6c48fcf832a50280))
* **getData:** update merge data to handle no data for a service ([6387419](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6387419daa73b24591f0d7fa32ff8477a2c803e5))

## [0.38.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.38.0...0.38.1) (2021-10-25)


### Bug Fixes

* Fixed connections between RDS cluster and instances ([eaf30a9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/eaf30a9532d9f58ae814ae8d925cd7c8bec380dc))

# [0.38.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.37.0...0.38.0) (2021-10-25)


### Bug Fixes

* Fixed broken tests ([c34a774](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c34a774b2ae517551a01edfb9fb6e5c6cc00b6af))


### Features

* Added IAM Global information as a service ([cbb6f97](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cbb6f976e546f8c08d7c8335dec885ee9d77c647))
* Added MFA devices to IAM User ([79a9ce7](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/79a9ce72cfe19c63d2daf055bdc174c5267b6c07))
* Added unit tests to IAM Global service ([cf9eaf0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cf9eaf0e1c08edc4064be4121c3b90c8d151d017))
* Split up IAM Global service ([88aa784](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/88aa784e8c876676324fab0d6417ab7c95543cde))

# [0.37.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.36.1...0.37.0) (2021-10-25)


### Features

* **elasticBeanstalk:** add elasticBeanstalk service ([8c7cfea](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8c7cfea00ee033002c2e62ab94a6a983251a95c9))

## [0.36.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.36.0...0.36.1) (2021-10-20)


### Bug Fixes

* **deps:** update deps to remove carrots ([dd1b894](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/dd1b8941059ec5be69c8dc952274b02d27e70e42))

# [0.36.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.35.0...0.36.0) (2021-10-20)


### Bug Fixes

* **rds:** cleanup ([745734a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/745734a988d89a286ce9b47286fc8ba0988d6f51))
* **rds:** drop cluster level parameterGroup ([25f18fd](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/25f18fde8748688bdef07e892a62235c12c49fda))
* **rds:** force folder name update git ([e90b2b1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e90b2b1176243624340e8fbcaedd7f6cbb78b846))
* **rds:** naming ([43e9644](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/43e9644e2506b23182b06a0678e56a084544caef))
* **rds:** naming, import cleanup ([873cebe](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/873cebe7a1a215913c76357ec0f4f81b3f71b1b9))
* **rds:** type name conformance ([43c1e27](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/43c1e277708cd5cb3b9e4df05759ed254867f805))
* **rds:** update connection ids ([9e01d18](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/9e01d18a1086b36d22a86d6032b26f60dd3d6fd7))
* **rds:** update instance cluster property to array ([324bde3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/324bde3fba9563ddcb616a2455b27eeca534ce1a))
* **rds:** update with new config changes, info -> debug, add connections ([bd1a918](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/bd1a91881398791e634398aba324fb7b63f3f6d7))


### Features

* **rds:** add rds cluster/instance service ([e40730c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e40730c7fa5fe2b2fb096c3c6581bb351635565f))

# [0.35.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.34.2...0.35.0) (2021-10-19)


### Bug Fixes

* Added [@id](https://gitlab.com/id) keyword to s3 id ([921a10c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/921a10c79aa1c369af0953c23d9d4307657f3142))
* Added MessageInterval util and renaming connections ([a4bc0a0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a4bc0a05286385b8eedb2be70ddb53f04d747577))


### Features

* Added connections to IAM services ([7edef39](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7edef39c7257cc4489877f9a9eb8f8635552543c))
* Added IAM service ([0d70384](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0d7038423d742184b396c2623932fd629b02c838))
* Added unit tests to IAM services ([e05aa67](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e05aa672ac2907c399133cbc17061dd85dd8e0a4))

## [0.34.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.34.1...0.34.2) (2021-10-14)


### Bug Fixes

* **acconts:** update account flow to enable passing keys directly at an account level (for override) ([a0287be](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a0287bea11f53b09d1f2d00b7798bd5b256a0084))
* **accounts:** update account flow to enable passing keys directly ([0ec112e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0ec112ebcf780cb1cb87b7e23eca1ecd90afa0e8))

## [0.34.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.34.0...0.34.1) (2021-10-13)


### Bug Fixes

* **alb:** fix alb connection for security groups ([484cd5b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/484cd5be46c0b0cb0583ab6e1ba257d1a0b4dbd4))

# [0.34.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.33.0...0.34.0) (2021-10-13)


### Bug Fixes

* **secretsManager:** tag service connection ([dc2928c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/dc2928cc00762fadcdd4a6307d142e789e30ac4a))
* **secretsManager:** uncomment aws_dynamodb_table in tf config ([e4c132a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e4c132a2eefb741d1f9df9beeec6fc4d9a998bb8))
* **secretsManager:** update SecretsManager class name ([cb5ae52](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cb5ae526df44725b3722bd9dab7ef284281996c1))
* **secretsManager:** update with new config changes, info -> debug ([d641364](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d641364074f07b0057b62cba08a96d76ceb77b9e))


### Features

* **secretsManager:** add secretsManager service ([62da466](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/62da4666dc38efb68afce4b10aa1cb1f314fa003))

# [0.33.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.32.0...0.33.0) (2021-10-13)


### Features

* **subnet:** add subnet service ([5caaed8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5caaed8efbfe08c4fd9f479efadd8848c2ab0df5))

# [0.32.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.31.0...0.32.0) (2021-10-13)


### Bug Fixes

* **ses:** update with new config changes, info -> debug ([c87d532](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c87d532c7dbba8c899992702fe2336b68aa10cfb))


### Features

* **ses:** add ses service ([a954752](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a9547523d17598944577795ba908cf393f0308e7))

# [0.31.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.30.0...0.31.0) (2021-10-12)


### Features

* **ecr:** add ecr service ([73c2d88](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/73c2d885ff095e99529347a4c5cf34b7cedd2ef1))

# [0.30.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.29.1...0.30.0) (2021-10-12)


### Bug Fixes

* **config:** update logs to use profile when there is no role ([32fb9bf](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/32fb9bff6a26a5387f28abb69b3f3a01808cc2e8))
* **creds:** update creds function for roles and default flow ([da804d3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/da804d35d60edcf5be49072ecaaf1324128188ef))


### Features

* **auth:** update auth to work with role arns ([d5d7aa5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d5d7aa53799ccbdc8061b5109075bd7c19c32d02))
* **multi-account:** update all services with new config setup ([364446f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/364446f1e9be3ac8872db6ad4a738aa89feaf927))

## [0.29.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.29.0...0.29.1) (2021-10-10)


### Bug Fixes

* **alb:** fix alb connections to use correct field for id ([7138f96](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7138f96822387f9da9873ebfde6122a759195124))

# [0.29.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.28.2...0.29.0) (2021-10-10)


### Bug Fixes

* **cloudfront:** added missing null/undefined checks ([58f169e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/58f169e76efec57a3e0baa49bd39ba2551bb7a30))
* **cloudtrail:** handle the case of the same cloudtrail living in 2 accounts ([4264059](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/426405910996b4ef2662d888129625af08f2a453))
* **cloudtrail:** update casing, add tag connection ([f943e05](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f943e054e8499d208e748edccdb370b8af78e7f9))
* **README:** fixing query in readme ([691d3ae](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/691d3aeabcdc71760ce8c77903aedb7182d4410a))


### Features

* **cloudtrail:** add cloudtrail ([42ec52d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/42ec52d0454aff5d2383b57f2b0e90faa69bb75a))
* **nacl:** add networkACL service ([40becb3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/40becb34e9831bfebe5021ad0d66bd5213d88b88))

## [0.28.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.28.1...0.28.2) (2021-10-07)


### Bug Fixes

* **toCamel:** fixing a case where value can be undefined and then this crashes ([43dda10](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/43dda1052959cc94e35c72da821fbe75f0df5942))

## [0.28.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.28.0...0.28.1) (2021-10-06)


### Bug Fixes

* **appsync:** update appsync to avoid access errors ([d51a960](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d51a9601c93dba48947b9c0362cb4edcf622b340))

# [0.28.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.27.1...0.28.0) (2021-10-06)


### Features

* **dynamodb:** add dynamodb service ([503030a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/503030a2bcc644d09ad06229e939e54ad76c1cb6))

## [0.27.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.27.0...0.27.1) (2021-10-06)


### Bug Fixes

* **billing:** Always query billing data if its a selected service, even if [secure] is NOT selected as a region ([ad858a4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ad858a450b8e34d52316d9500e9313e18572f825))

# [0.27.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.5...0.27.0) (2021-10-06)


### Bug Fixes

* **getData:** add back sorting resource deps, add check to avoid crawling the same account twice ([c3d30e0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c3d30e00cd0134173e436e5ba852f7215a58202e))
* **lambda:** fix lambda schema and env variable ([c143041](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c1430417485d1de530b935e677879797d83ef902))
* **multiAccount:** (re)added getData logging for regions and resources ([5afa8d2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5afa8d27d72bec9cbcd0a2a7da440e17b2085d8f))
* **multiAccount:** Add accountId in API Gateway results ([5fb8581](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5fb8581c2f9c84f152df5728d2534353eebf96b3))
* **multiAccount:** add accountId on services schema ([73763e1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/73763e1067c1f5929d41b609b9e76a02fb3299bf))
* **multiAccount:** add accountId on services schema ([00d51aa](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/00d51aa8eb12e183324fa092f29d59e6eb95efeb))
* **multiAccount:** add accountId on services schema ([d97508b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d97508b9650dd81452bdcdbae12a877c94701615))
* **multiAccount:** added exception handling for missing/empty AWS credential file, verify profiles in AWS credential file ([f77c052](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f77c052a67ce92ec7cba0b4ff20c7d6d542b9cb5))
* **multiAccount:** drop promise type ([d3d4843](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d3d4843af68fd7c5009c63410c26fc4679629a98))
* **multiAccount:** merge conflict ([e71e0c7](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e71e0c7b1ae1b8cdcfec96132fdbfd380da13feb))
* **multiAccount:** move getData result function scope ([f98e531](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f98e53144679f0f6abae621450044b88773d8d13))
* **multiAccount:** pause logger on cred prompt, spelling ([ec48b15](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ec48b15514bc2f32799fbc1397414d21308495ed))
* **multiAccount:** remove [@id](https://gitlab.com/id) on accountId lambda schema ([ab0192a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ab0192a82ce4619171dd7cc217d2b26f15f2c6a6))
* **multiAccount:** remove auto imports ([5ca06a5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5ca06a5132d7219d33d52efb1b05764de3196b3a))
* **multiAccount:** track credentials for reuse ([5e8e64c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5e8e64c4b987005c02031aaa24554796318e1361))
* **multiAccount:** use top level settings for approved profiles ([153aed5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/153aed523bf0e9230fa3c7b0770486842bbdab98))


### Features

* **getData:** Update get data to handle multi accounts. Remove some issues on asg and ec2 schemas. Handle default for no profiles selected in config. ([907c262](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/907c262d963b7bfb5cd0dc084fc8c60ac1e78ac7))
* **multiAccount:** iterate config profiles, pass profile params ([555f7a3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/555f7a394f0cab03863b1b6df3f320153b0469ac))

## [0.26.5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.4...0.26.5) (2021-10-04)


### Bug Fixes

* **asg:** remove id from metric field ([6796aa5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6796aa588b7e946e7b15149ccc1f2259d95d7c57))

## [0.26.4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.3...0.26.4) (2021-10-01)


### Bug Fixes

* **billing:** format data file and update to still grab last30 daily average when month data not available ([8e55cbe](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8e55cbe008c520f470436cf5b40cb818a4b2509b))
* **billing:** handle case where you cant get month to date data because its start of the month ([8c8046b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8c8046ba6cbb3f2fa35d9d205aaa1ccc3a934a23))

## [0.26.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.2...0.26.3) (2021-09-30)


### Bug Fixes

* **kms:** update field name from enableKeyRotation to keyRotationEnabled ([362388d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/362388d572a94e7b49fc2f199978c61052ee6b5a))

## [0.26.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.1...0.26.2) (2021-09-29)


### Bug Fixes

* **deps:** update sdk dep ([020613e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/020613eedca87c7e39a125a716e668008888d900))

## [0.26.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.26.0...0.26.1) (2021-09-29)


### Bug Fixes

* **billing:** update billing for new structure ([6787f7b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6787f7b4261095664be95ed0206be54b80cda81c))

# [0.26.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.25.2...0.26.0) (2021-09-29)


### Features

* **cloudFormation:** add cloud formation stack and stackSet ([bdeea8c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/bdeea8c982fd510dbd83bfe7f63df0665841571c))
* **FinOps:** Daily averages for FinOps data ([632c601](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/632c6017bd26cfdf250ed4ba41888b1675a7b8b5))
* **FinOps:** Daily averages for FinOps data ([2c19bec](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2c19bec133c231d70f26030fc09c79a910f7d48e))

## [0.25.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.25.1...0.25.2) (2021-09-28)


### Bug Fixes

* Reduce duplication of calls between dependant services ([f9c975c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f9c975cc510cbe0d05b7feaa29527b5f6ce77d5a))

## [0.25.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.25.0...0.25.1) (2021-09-28)


### Bug Fixes

* Fixed duplicated ARN at Route53 record ([fa2614d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/fa2614d149db318cce4affb2e442fcf0b01298ef))

# [0.25.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.24.3...0.25.0) (2021-09-27)


### Features

* Added tag connections to App sync service ([7d02a59](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7d02a59009333446a919fdeedf3e24ccb162cc02))
* **appsync:** add appsync ([57ce867](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/57ce86789fafcfb35d37fe1e42b758e8bdd2dfd4))

## [0.24.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.24.2...0.24.3) (2021-09-27)


### Bug Fixes

* **tags:** update tags schema for cloudfront ([fdf9962](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/fdf9962da33a2c4bdd80a522bb7f8f10514e4ebc))

## [0.24.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.24.1...0.24.2) (2021-09-27)


### Bug Fixes

* **asg:** added ids to awsSuspendedProcess and awsSuspendedProcess fields ([a2f7999](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a2f79997572aa12e6b05fb8d446998f1260a68cc))

## [0.24.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.24.0...0.24.1) (2021-09-27)


### Bug Fixes

* Added api gateway connection to route53 record ([3dc6bdb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3dc6bdbc4de121948c69f5831dbf8db614dd0f6c))
* Added missing domain name data to API gateway ([de969cd](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/de969cdeea5a565122e34fe3cbee33068f2925a2))
* Uncomment cognito tests ([13838f5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/13838f59c229da6fe5ea823db1a9204be07de0b9))

# [0.24.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.23.0...0.24.0) (2021-09-27)


### Features

* **cloudfront:** add cloudfront service ([28bbeb2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/28bbeb2c290e50732aef5a92dc39f8dbeffd58ac))

# [0.23.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.22.2...0.23.0) (2021-09-24)


### Features

* **kinesisFirehose:** add kinesis firehose service ([12cd3e7](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/12cd3e79f7900dbb332de08b58822b6f18c53378))

## [0.22.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.22.1...0.22.2) (2021-09-24)


### Bug Fixes

* Prevent errors formatting s3 additional data ([1a5a053](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/1a5a053d0d0ab160afc857bcfa09463acf0ad8a5))

## [0.22.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.22.0...0.22.1) (2021-09-24)


### Bug Fixes

* **provider:** Add try/catch blocks to all getData functions for more error details ([3c45469](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3c45469c9f4e789bc417335740afcf5e6634596f))

# [0.22.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.21.1...0.22.0) (2021-09-24)


### Bug Fixes

* **billing:** update billing code to fix not scanning ec2/nat ([2e4b781](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2e4b78115c3a550417dcfe39a98e0c3dbb6be423))
* Prevent errors getting s3 additional information ([d827eac](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d827eac1d406f708280e019cbfae92b7efcdd840))


### Features

* **billing:** Add new billing service and logic to update ec2/nat entities with billing data. Fix small bugs in SQS and service loop; ([8e72984](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8e7298430e378ddc41cb4b0160bf88d713d3b322))

## [0.21.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.21.0...0.21.1) (2021-09-24)


### Bug Fixes

* **aws-provider:** added new retry options ([44a30bd](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/44a30bd68b3ada76d4894e4d7d68a9f86bce698d))

# [0.21.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.20.0...0.21.0) (2021-09-22)


### Bug Fixes

* **cognito:** Update cognito for tags connections ([5fe3081](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5fe308128a5207d53f64b6be017db4843fd3ba55))
* **deps:** update sdk dep and remove unneeded deps ([b9d99bb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b9d99bbd7341a55de3fac6c4c0c400bd37ce5ae4))
* **tests:** comment out tests as cognito is ls pro service ([9163309](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/916330990633e97214bfdce6bdab88b00348a311))


### Features

* **cognito:** add cognito user pool and identity pool ([a97eff1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a97eff124750916fd0fc115d7cd8c586ec0f7dac))

# [0.20.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.19.0...0.20.0) (2021-09-21)


### Features

* Added S3 service ([7933db1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7933db13c75329a0c99487d89d1caf83db5d707f))
* Added unit tests for S3 service ([b0cff5d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b0cff5d5b56bd65f5853211ceaa791ca06618816))

# [0.19.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.18.1...0.19.0) (2021-09-20)


### Bug Fixes

* **creds:** Update with profileApprovedList so we only prompt once ([ceb15ad](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ceb15ad464f37cb0778145ddb1fa87914e0eedfc))


### Features

* **creds:** update creds function to ask if the creds are ok to use ([032cd61](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/032cd61f0b6694307eb481a737b01926b404af8e))

## [0.18.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.18.0...0.18.1) (2021-09-20)


### Bug Fixes

* **nat:** fixing NAT Gateway ARN ([3c04d74](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3c04d74e5e5ad609426e23aaf559eed910372a5c))

# [0.18.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.17.0...0.18.0) (2021-09-16)


### Features

* Added connections ([5620963](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5620963020f2e7c0b519c79892d258f930117068))
* Added Route Table service ([7d70b8f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7d70b8f4db17b6af2cb34e9cb9ec07f451ebd59d))
* Added unit tests for Route Table service ([dc21f7d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/dc21f7da660e3f8fb4c1e5e239493947d0499792))

# [0.17.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.16.4...0.17.0) (2021-09-15)


### Features

* Added route53 service ([537d6be](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/537d6be1fa3d2c46c7e071d2be75dbee91bd37e3))
* Added tests for Route53 ([a3ec6c7](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a3ec6c7c2c0dd4ef8770ed88942d5320a1656fbd))
* Reuse new util to generate route53 ids ([604e0d9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/604e0d962691ae67b97a8a02450058bc1e16b2c7))

## [0.16.4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.16.3...0.16.4) (2021-09-15)


### Bug Fixes

* Fixed Kinesis unit tests ([4345517](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/43455170171734b3fb3e803d1e5452e9ca27bf34))
* Fixed SQS unit tests ([0cadfae](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0cadfaefc460f504ebda2b51bf4d481c29235528))

## [0.16.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.16.2...0.16.3) (2021-09-15)


### Bug Fixes

* **logging:** improve aws error logging with new util. catch permissions errors specifically. small fixes ([11e0903](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/11e09036cb0dec43c14410375d0d02901aba5e6f))
* **readme:** update service table with kinesis stream ([f930ffe](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f930ffebc435e6e8f87c72a46fc56ef65f24cb42))

## [0.16.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.16.1...0.16.2) (2021-09-14)


### Bug Fixes

* **logging:** improve ux for aws configuration by logging out what resources/regions are configured ([2bdd84a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2bdd84ad73fbf06cce2c6b8335f6b499b5ca17c2))

## [0.16.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.16.0...0.16.1) (2021-09-14)


### Bug Fixes

* **service:** Fix API Gateway Stage <=> API Gateway Rest api connection ([6bc7e9e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6bc7e9e57a7c67f21cf5966a0696144042bd6714))

# [0.16.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.15.1...0.16.0) (2021-09-13)


### Features

* **kinesis:** add kinesis ([d5e9b30](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d5e9b307c9ab2509db17bd6405d7fed552897f4e))
* **kinesis:** update warning log ([42e859a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/42e859a9f22d3518772437447f678b1a14803d32))

## [0.15.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.15.0...0.15.1) (2021-09-13)


### Bug Fixes

* **logs:** update provider data logs to standardize them ([0713184](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/071318430211a871623a21902ab475c06fd507a9))
* **schema:** fix serveral schemas and format functions to avoid duplication. Need to use an id outside dgraph that is generated in the code ([8501203](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/8501203526196a3ab77e1615c3d945f0b44c337e))
* **sg:** update SG rules to allow peeringStatus and groupName. No longer just pass anything left from the rule as it could break schema ([6087350](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6087350e4831512f7abe3a70c042cd6cbcc046e5))
* **sg:** use a cuid generated in code for the rules so we dont get duplicates in rules ([68c0ea5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/68c0ea55ad82c26c7f3450f1aec214574688ce9c))
* Solved issue with duplicated XID Lambda env variables ([7b1c2a2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7b1c2a26770d0a8e764ba67ed422b042635e5464))

## [0.15.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.15.0...0.15.1) (2021-09-13)


### Bug Fixes

* Solved issue with duplicated XID Lambda env variables ([7b1c2a2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7b1c2a26770d0a8e764ba67ed422b042635e5464))

# [0.15.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.14.1...0.15.0) (2021-09-09)


### Features

* **README:** Update readme with more details and add contributing file ([b063f8e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b063f8ea35302ed63110e7d0e1200e30d35bf895))

## [0.14.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.14.0...0.14.1) (2021-09-09)


### Bug Fixes

* Prevent error when listing autoscaling groups ([a79f117](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a79f117625df16052966dbed518a43c4c40a222d))

# [0.14.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.13.0...0.14.0) (2021-09-08)


### Features

* **asg:** add asg ([f9f656a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f9f656abd409623653a034cf99a6b5e417ea43ed))
* **asg:** add inverse fields to schema ([2d9913f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2d9913fcb29fb43dbedc6c447968e02da6bca40a))
* **asg:** add security group and EBS connections ([ccb18f9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ccb18f9aa232d3899c8f2a6e87769194eaa2b97e))

# [0.13.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.12.1...0.13.0) (2021-09-07)


### Bug Fixes

* **sqs:** Update sqs to connect to top level tags and have correct field ([0592e5e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0592e5e8af9db836b85bc7c111bff58c2f806682))
* **sqs:** update to use logger and fix comment change ([590e8b3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/590e8b317a1369596072caa762be6aae74c29bbc))
* **tags:** Add an id field to tags to enforce uniqueness. ([2d2d97c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2d2d97c7af03c1b629aae5a6a282c73516720211))


### Features

* **sqs:** code updates ([d0f2e49](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d0f2e4965c11e4f7cad91dd7e75d4d4ee41e3b77))
* **sqs:** move formating tags to format.ts ([3dd8c93](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3dd8c93d1eaaae5979324353bd99f3bd6ade4f54))

## [0.12.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.12.0...0.12.1) (2021-09-07)


### Bug Fixes

* **client:** Fix in getData that caused duplicate data when more than one region had data ([b2bb5fc](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b2bb5fc7466e2ed3f4641bffcf0c0e84b7548f6c))

# [0.12.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.11.4...0.12.0) (2021-08-31)


### Features

* **versioning:** update package.json to include cloudGraph key for versioning. Update sdk version ([36a2521](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/36a2521050b978c3cc16542b0922b21d86f92adf))

## [0.11.4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.11.3...0.11.4) (2021-08-25)


### Bug Fixes

* **apiGateway:** generate stage arn with rest api id ([a9aa960](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a9aa960dc243b65178918888127b95ed097a191f))

## [0.11.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.11.2...0.11.3) (2021-08-24)


### Bug Fixes

* **creds:** Update logging to inform user what creds are being used ([4e70245](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/4e70245ae2d76dc1e45b9361c5e869887f6981fd))

## [0.11.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.11.1...0.11.2) (2021-08-24)


### Bug Fixes

* Adding missing connections ([0e32e49](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0e32e491034b7f53c89788faba309a6a3615a755))
* Completed ALB tests ([29e79e0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/29e79e0514e081612fb16e753bc9761ec02e5778))
* Completed Cloudwatch tests ([18d5c10](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/18d5c10194b9771dcc0ad6115abc661c95b862c9))
* Completed EIP tests ([4fbd109](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/4fbd109884022695b61ec68a429845fde9bf01dc))
* Renamed it to test keyword ([2d6304f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2d6304f43809cc86256c587fe94d4f7f2bef47f6))

## [0.11.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.11.0...0.11.1) (2021-08-24)


### Bug Fixes

* **regions:** update regions prompt with default ([805613f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/805613f78542f236569a080dad889294091bc79c))

# [0.11.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.10.1...0.11.0) (2021-08-23)


### Features

* **interface:** Update the Client interface for the provider to simplify the need to export functionality ([65e1abe](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/65e1abe9e2746cc0b9396c2577abf62dfd71066b))

## [0.10.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.10.0...0.10.1) (2021-08-23)


### Bug Fixes

* **package.json:** add Github repository references ([b2ca4f5](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b2ca4f5e3e21b093b30f205f467b96e063ac8ff5))
* add Github repository references ([2c94f4a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2c94f4afb15b94bd0ae53cf3bbd3276cb2c17834))

# [0.10.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.9.2...0.10.0) (2021-08-23)


### Bug Fixes

* **search:** fix for lambda connections on vpc and tag. update search for kms and sg ([75e572d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/75e572ddff3daf61fbc4b45b129f7f67ba0827bb))
* **search:** update sg schema to have arn be required ([28d880a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/28d880a8a360687f5ff12acbd4a2dd3114694220))


### Features

* **search:** update all schemas to handle searching ([d99e788](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d99e7889c0dc4b056cfe57770bbeb9ce65b7f9c5))
* **search:** update all schemas to handle searching ([eb78471](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/eb78471f05772f1313ec6667f30013a514061bce))

## [0.9.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.9.1...0.9.2) (2021-08-23)


### Bug Fixes

* Removed duplicated resources and regions from cloud-graphrc file ([c073ce8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c073ce86e2457b782a1ba8a280a11006c0db6acd))

## [0.9.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.9.0...0.9.1) (2021-08-22)


### Bug Fixes

* **config:** remove undefined EKS service ([4b97f74](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/4b97f7467e3ffa17bd07105f48b3f362db7c23a7))

# [0.9.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.8.0...0.9.0) (2021-08-20)


### Features

* **natGateway:** add natGateway to services ([c8dc27c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c8dc27cf14d3d42b758c4897ebda6ad8c32eddbc))

# [0.8.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.7.0...0.8.0) (2021-08-20)


### Bug Fixes

* **apiGateway:** add get/format test, add test infra ([27b61b0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/27b61b038bc26997eba19b57f6d217c5dd35ea32))
* **apiGateway:** add new type, improve typing on format ([679a2c1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/679a2c1c4658d164f85af5e42b6c20fe526072a7))
* **apiGateway:** add resource edges, update name ([5d0d6b1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5d0d6b1a0335f1232bb7155a17ce355fa506d799))
* **apiGateway:** add resources/stages as top level services, add tests ([86e7337](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/86e73379bae0ec40227d9ada0242abef1f6e5f30))
* **apiGateway:** add service enum, add to serviceMap ([6654ccb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/6654ccb1ada452e1a29a7c2c18bf83819afde83e))
* **apiGateway:** conform tag formats ([3f9ab7c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3f9ab7c1ba6a03520559aa08233faa260b7945c2))
* **apiGateway:** conform tag formats ([7c919cc](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7c919cc1d9815162362d68b25a114b2bfce5e558))
* **apiGateway:** expose graphql ID on schema ([3aa0804](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/3aa080442fdd065b5dbbe19e1b70929e99535ef5))
* **apiGateway:** lint changes ([ce1514e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ce1514eb485df2e624d28f90636b818d11e3920e))
* **apiGateway:** logger statements ([315436d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/315436d304010d0873f8c8ce892384cb8018af02))
* **apiGateway:** merge conflicts ([1115a89](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/1115a893aa9d27878e76610a07e019d372d80de2))
* **apiGateway:** moved fetched logger statements ([2a7f11f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2a7f11fd1d5213a4d3e04bc63f1e77cf79a25e30))
* **apiGateway:** mutation naming ([cdbf24f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cdbf24f77bc36ce700bdc46b2609345eec331568))
* **apiGateway:** mutation naming ([de4bad1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/de4bad16b1159afbe1b8849f260d5bc737a3df61))
* **apiGateway:** tf config ([b7047ee](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b7047ee0279cb40108a9db5317355287584ee120))
* **apiGateway:** update type names ([4116c93](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/4116c93b1cc42baa58ad7a117dbbbb9a437c3e74))
* **apiGateway:** use arn for stage connection, use rest api id in format ([fac7701](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/fac7701620f9fd219f76ac8b898a7fe627ed6b83))
* **apiGateway:** use stage name in connection id ([f41226c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f41226cc17a39f4db6a4d1c4c5fb1c4512827af0))


### Features

* **apiGateway:** add apiGateway to services ([165512f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/165512f1e7f5f0d5259ca4bfe90a80dd66812417))

# [0.7.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.6.0...0.7.0) (2021-08-19)


### Features

* **ec2:** Added tests for EC2 connections ([b3cdab4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b3cdab493aee8dbc3fe52d2e517965f04a0a1b89))
* **ec2:** Added TODO unit tests boilerplate ([cd3c37c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cd3c37c3c8eea5d7244f58baf918615559a254f4))
* **ec2:** Adding types to getData method ([b41f16b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b41f16bd57d93f7bcaf62b187ccedbe67781744e))
* **ec2:** Cleaned up format EC2 file ([051d7c3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/051d7c3e06410e2a4bc0252d96c71cc2eda46c4a))
* **ec2:** Fetch missing data from aws-sdk ([c68d5c6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c68d5c628046580491a8e31debd969356cfcd78a))
* **ec2:** Linked connections to EBS ([bd0ec49](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/bd0ec4972d494fc0a8730d9edc6df61c4c10400d))
* **ec2:** Linked connections to EIP ([b2991fc](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b2991fc9acc1dad9700d689519c677e12b23ccac))
* **ec2:** Linked connections to SG ([590b4be](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/590b4bea1ee129007e2ab4f7c8ea7137f9923a27))
* **ec2:** Updated format tags util ([d781e1d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d781e1dd146f3918d09577671144e0d63631fa48))
* **kms,lambda,sg:** add kms, lambda and sg to services ([b54caf3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b54caf320b4c98c43bb6b09b095a15025b756d22))
* **kms,lambda,sg:** add kms, lambda and sg to services ([2f56554](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2f56554425f2b3b9647d75561452e833c25516a3))
* **kms,lambda,sg:** add kms, lambda and sg to services ([670689f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/670689f1aff6c143793c3227b06e28bf2d19c51d))
* **terraform:** add terraform/localstack integration, add README, update tests ([127b0eb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/127b0eb7c25a1cfa7024393ee38d46aaabbf61ea))

# [0.6.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.5.0...0.6.0) (2021-08-19)


### Features

* **vpc:** update & complete vpc service ([a31d880](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a31d880c84cb440e29a766cefa1069114e3c5628))

# [0.5.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.4.0...0.5.0) (2021-08-19)


### Features

* **elb:** Added ELB to allowed services ([82105b6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/82105b632d7a7bc83a554e0151495082fc136c7c))
* **elb:** Added SG connection ([0118f6b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0118f6b87abcc4d75297b202b75a3523e95efc81))
* **elb:** Added TODO unit tests boilerplate ([2cdfd78](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2cdfd7812162bb12c48d8044b6911a06dc94f401))
* **elb:** Added VPC connection ([7fcfa75](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7fcfa7548d21ca5b67138f50adec250c5ff89b23))
* **elb:** Created ELB service ([66037f6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/66037f6768781a43cde9afd0fecdd80d396ab00c))
* **elb:** Fixed schema and types ([f0351b0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f0351b020d45f1968b0abd919e92a1ad3ff0b358))
* **elb:** Formatted ELB data ([ec435a4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ec435a4abce24491b7511d456c2fb7426c3659d6))
* **elb:** Ignore generated files ([74f454a](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/74f454a34211ef22eb6a0c4c919832116754a603))
* **elb:** Updated format tags util ([d6c7b88](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d6c7b88e4f32fe122e2cd33616907c8ff8851e6a))

# [0.4.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.3.0...0.4.0) (2021-08-19)


### Features

* **networkInterface:** Updated format tags util ([e137582](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e1375821c78b1349bc06c91a24e08d10a0936dfb))
* Added network interface service ([787870d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/787870d91c9382ee13cb113a7abeece5fdc7d058))

# [0.3.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.2.4...0.3.0) (2021-08-18)


### Bug Fixes

* **build:** update build script to wipe the dist folder before recreating ([2021599](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/2021599c3669d171759a0eb0e8359e22a4a2f1d7))


### Features

* **tags:** Begin work on tags service ([b9d0010](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/b9d00102e79413368411507d3a6f70d180194cd1))

## [0.2.4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.2.3...0.2.4) (2021-08-17)


### Bug Fixes

* Included cleanup script for terraform files ([4ea390d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/4ea390ddc8dee692b07027028c75c3587c2f8faf))

## [0.2.3](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.2.2...0.2.3) (2021-08-17)


### Bug Fixes

* **deps:** add missing dep dotenv ([002280f](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/002280f1bde9aa2e57417eb3432315e2c5f07c4d))

## [0.2.2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.2.1...0.2.2) (2021-08-17)


### Bug Fixes

* **deps:** add missing dep @graphql-tools/merge ([26c1566](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/26c1566856600e4ba9e6909d3d199a7bd6adf03a))

## [0.2.1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.2.0...0.2.1) (2021-08-16)


### Bug Fixes

* **tests:** add tags to kms key in tf config ([48d7eee](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/48d7eee1a927fb908cceed5d9825adb3e725fad9))
* **tests:** igw merge corrections ([cd497b0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cd497b0eb58a835b0d715edd70cabb05603165fd))
* **tests:** remove ebs mocks, add tf infra ([ed8e32c](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ed8e32c1c0187eab7dbbad4b53933f22641a4f64))
* **tests:** remove lambda mocks ([f3fb691](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f3fb691f816ded7deb4a7e3f5fcab864a49c4191))
* **tests:** remove mocks for kms, added tf infra ([007b37e](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/007b37e4cded8a02df6dff6abd9b5f77debe92be))
* **tests:** remove sg mocks, add tf infra ([97d1ed8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/97d1ed88f73147a00b2f21f62a8521f58f6117ec))
* **tests:** scope jest tests dir ([0568ab6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/0568ab6b5abc1b9c8620d6c91f60bf7ad7c2a5f4))

# [0.2.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.1.0...0.2.0) (2021-08-16)


### Features

* **LICENSE:** update license to MPL v2.0 ([c1f7842](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/c1f784211629255b8f136ef464573e89a9d67500))
* **LICENSE:** update License to MPL v2.0 ([73a93c1](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/73a93c124cb75acdf9d6e7146542590aad60bb92))

# [0.1.0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/compare/0.0.1...0.1.0) (2021-08-12)


### Bug Fixes

* **access:** fix data accessors to avoid errors ([d04f8e2](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d04f8e2847d32de384a9c6f7e3e706f9b461e577))
* **ebs:** Fix EBS attachment schema ([22d5b49](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/22d5b49b2de7e79b77734d06149914bc5e38a34b))
* **getSchema:** print string of merged typeDefs ([a224869](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/a2248698335d4c57b25dde3347bddecf3c63cbe7))
* **lambda:** fix misspelling on lambda mutation ([e45a7d9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e45a7d9158cf100fb284c6c4864251d1c780279e))
* **package:** update sdk package name ([ff319f9](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ff319f9a9bbb0bcf06bc0e290bf5dc0678d2b707))
* **package.json:** add @cloudgraph/sdk dependency ([afb6da6](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/afb6da68503e582617a497f5ae38f7406105ea14))
* **package.json:** bump husky to v7 ([beeb747](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/beeb74787c430ece0901237ac8732d6d9bd1bae8))
* **sg:** rename schema field ([24ca856](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/24ca856c10e09ebfe28b753cffd4d17d827c0f72))
* **tag:** remove yalc refs and update tags schema ([67053d8](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/67053d8c8dc63c52f58b03dd3ed8b0ad1a7a7e6d))
* **tsconfig:** fix Node type reference errors on compile ([88487d4](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/88487d4697fdae2f97aae98858015dbab4b0cf1c))
* **tsconfig:** Fixed ECMAScript target version ([fc3ff93](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/fc3ff93dbe6183778a4e61c3bf70f7c135a8364f))


### Features

* **alb:** update alb functions and add generated types. Rework the provider integration ([d5cdc26](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/d5cdc26634922d90ac6fa734515581f81aec2501))
* **alb:** Update alb schema to fix duplication bug ([5575b1d](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/5575b1df600a6f74f4dca509ffb33a1ee5d4982e))
* **cloudwatch:** add cloudwatch to services ([7fde649](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/7fde6490ea9f9b18c826df50f62dbee408b0f3dd))
* **creds:** Update credentials to be more flexible ([e526cfb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/e526cfb6b1bd5708447a7881bf0c956d54ac3e41))
* **eslint:** ESLint rules setup ([861b733](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/861b733bd7bf46e49c5bccbd406170f70350298f))
* **igw:** add igw to services ([47f23da](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/47f23da1a001e2c22ab2cac690fb72c05ce71826))
* **kms,lambda,sg:** add kms, lambda and sg to services ([9954146](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/995414675544b81371e8c43cf7b90e400280316f))
* **logger:** update logger for aws module, attach logger to classes when needed, otherwise just require and use ([36b88bb](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/36b88bbb96bbaeae6ff2df3ff40993b160ca7bda))
* **naming:** update all naming to be camelCase. Update logging to be less... ([cfb6c9b](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/cfb6c9b4bfd21e4e3a731f130d0b49f77b334674))
* **terraform:** add terraform/localstack integration, add README, update tests ([53bcba0](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/53bcba0f7f924c917778a5c1ec73ad9137ba93d5))
* Add EIP to services ([ef41b53](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/ef41b536e25bc3f99b5b036fc8a57e99f947f2d1))
* **types:** Add type generation using graphql-codegen and create codegen yaml... ([f28f556](https://gitlab.com/auto-cloud/cloudgraph/provider/cloudgraph-provider-aws/commit/f28f5565dcff73a4352c577fd79cec45599ce045))
