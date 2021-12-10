export default `mutation($input: [AddawsTransitGatewayInput!]!) {
    addawsTransitGateway(input: $input, upsert: true) {
      numUids
    }
  }`