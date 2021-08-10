CloudGraph AWS Provider
===========

Scan cloud infrastructure via the [AWS SDK ](https://github.com/aws/aws-sdk-js)

# Development

Install all the dependencies:
```
yarn
```

Generate types and compile:
```
yarn build
```

## Testing
<!-- testing -->
Install terraform:
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

Start an instance of [LocalStack](https://github.com/localstack/localstack) to mock cloud APIs on your local machine:
```
docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack
```

Provision infrastructure in LocalStack:
```
yarn terraform
```
Run tests:
```
yarn test
```
<!-- testingstop -->