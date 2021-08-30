export default `mutation($input: [AddawsApiGatewayRestApiInput!]!) {
  addawsApiGatewayRestApi(input: $input, upsert: true) {
    numUids
  }
}`