export default `mutation($input: [AddawsEfsInput!]!) {
  addawsEfs(input: $input, upsert: true) {
    numUids
  }
}`