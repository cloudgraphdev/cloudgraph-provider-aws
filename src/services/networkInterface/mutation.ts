export default `mutation($input: [AddawsNetworkInterfaceInput!]!) {
  addawsNetworkInterface(input: $input, upsert: true) {
    numUids
  }
}`
