export default `mutation($input: [AddawsIamInstanceProfileInput!]!) {
  addawsIamInstanceProfile(input: $input, upsert: true) {
    numUids
  }
}`
