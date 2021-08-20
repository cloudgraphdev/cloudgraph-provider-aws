export default `mutation($input: [AddawsNatGatewayInput!]!) {
  addawsNatGateway(input: $input, upsert: true) {
    numUids
  }
}`