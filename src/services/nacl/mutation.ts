export default `mutation($input: [AddawsNetworkAclInput!]!) {
  addawsNetworkAcl(input: $input, upsert: true) {
    numUids
  }
}`