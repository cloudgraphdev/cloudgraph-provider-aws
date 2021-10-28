export default `mutation($input: [AddawsSnsInput!]!) {
  addawsSns(input: $input, upsert: true) {
    numUids
  }
}`
