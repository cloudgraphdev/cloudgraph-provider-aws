export default `mutation($input: [AddawsSubnetInput!]!) {
  addawsSubnet(input: $input, upsert: true) {
    numUids
  }
}`
