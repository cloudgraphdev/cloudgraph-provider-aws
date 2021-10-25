export default `mutation($input: [AddawsEcsServiceInput!]!) {
  addawsEcsService(input: $input, upsert: true) {
    numUids
  }
}`