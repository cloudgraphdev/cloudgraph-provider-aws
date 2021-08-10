export default `mutation($input: [AddawsVpcInput!]!) {
  addawsVpc(input: $input, upsert: true) {
    numUids
  }
}`
