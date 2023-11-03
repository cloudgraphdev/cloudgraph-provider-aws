export default `mutation($input: [AddawsApiGatewayHttpApiInput!]!) {
  addawsApiGatewayHttpApi(input: $input, upsert: true) {
    numUids
  }
}`