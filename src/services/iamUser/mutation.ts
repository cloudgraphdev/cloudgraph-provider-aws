export default `mutation($input: [AddawsIamUserInput!]!) {
  addawsIamUser(input: $input, upsert: true) {
    numUids
  }
}`
