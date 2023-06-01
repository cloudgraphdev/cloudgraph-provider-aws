export default `mutation($input: [AddawsSesInput!]!) {
  addawsSes(input: $input, upsert: true) {
    numUids
  }
}`
