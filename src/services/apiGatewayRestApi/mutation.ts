export default `mutation($input: [AddawsApiGatewayInput!]!) {
  addaws_apigateway(input: $input, upsert: true) {
    numUids
  }
}`