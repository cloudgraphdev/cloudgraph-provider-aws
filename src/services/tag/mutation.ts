export default `mutation($input: [AddawsTagInput!]!) {
  addawsTag(input: $input, upsert: true) {
    numUids
  }
}`;
