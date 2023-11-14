export default `mutation($input: [AddawsApiGatewayVpcLinkInput!]!) {
  addawsApiGatewayVpcLink(input: $input, upsert: true) {
    numUids
  }
}`
