export default `mutation($input: [AddawsVpcLinkInput!]!) {
  addawsVpcLink(input: $input, upsert: true) {
    numUids
  }
}`
