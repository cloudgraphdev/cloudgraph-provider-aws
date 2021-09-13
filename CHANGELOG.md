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
