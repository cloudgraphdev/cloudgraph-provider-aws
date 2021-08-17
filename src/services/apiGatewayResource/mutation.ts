export default `mutation($input: [AddawsApiGatewayResourceInput!]!) {
  addawsApiGatewayResource(input: $input, upsert: true) {
    numUids
  }
}`