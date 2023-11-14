export default `mutation($input: [AddawsApiGatewayApiKeyInput!]!) {
  addawsApiGatewayApiKey(input: $input, upsert: true) {
    numUids
  }
}`
