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
