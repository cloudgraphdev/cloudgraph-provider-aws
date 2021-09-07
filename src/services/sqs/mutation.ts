export default `mutation($input: [AddawsSqsInput!]!) {
  addawsSqs(input: $input, upsert: true) {
    numUids
  }
}`;
