export default `mutation($input: [AddawsSesEmailInput!]!) {
  addawsSesEmail(input: $input, upsert: true) {
    numUids
  }
}`
