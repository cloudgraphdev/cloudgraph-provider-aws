export default `mutation($input: [Addaws_vpcInput!]!) {
  addaws_vpc(input: $input, upsert: true) {
    numUids
  }
}`