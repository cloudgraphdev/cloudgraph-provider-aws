export default `mutation($input: [Addaws_apigatewayInput!]!) {
  addaws_apigateway(input: $input, upsert: true) {
    numUids
  }
}`