export default `mutation($input: [AddawsClientVpnEndpointInput!]!) {
    addawsClientVpnEndpoint(input: $input, upsert: true) {
      numUids
    }
  }`
  