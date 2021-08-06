export default `mutation($input: [AddawsKmsInput!]!) {
  addawsKms(input: $input, upsert: true) {
    numUids
  }
}`;
