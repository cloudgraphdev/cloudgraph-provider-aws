export default `mutation($input: [AddawsTransitGatewayRouteTableInput!]!) {
    addawsTransitGatewayRouteTable(input: $input, upsert: true) {
      numUids
    }
  }`