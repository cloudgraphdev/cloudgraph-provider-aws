export default `mutation($input: [AddawsEipInput!]!) {
  addawsEip(input: $input, upsert: true) {
    numUids
  }
}`;
