export default `mutation($input: [Addaws_eipInput!]!) {
  addaws_eip(input: $input, upsert: true) {
    numUids
  }
}`;
