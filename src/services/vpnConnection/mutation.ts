export default `mutation($input: [AddawsVpnConnectionInput!]!) {
    addawsVpnConnection(input: $input, upsert: true) {
      numUids
    }
  }`
