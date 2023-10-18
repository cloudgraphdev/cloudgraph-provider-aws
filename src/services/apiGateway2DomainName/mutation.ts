export default `mutation($input: [AddawsApiGatewayDomainNameInput!]!) {
  addawsApiGatewayDomainName(input: $input, upsert: true) {
    numUids
  }
}`