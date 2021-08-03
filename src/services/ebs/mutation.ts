export default `mutation($input: [AddawsEbsInput!]!) {
  addawsEbs(input: $input, upsert: true) {
    numUids
  }
}`
