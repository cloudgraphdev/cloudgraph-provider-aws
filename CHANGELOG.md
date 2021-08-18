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
