export default `mutation($input: [AddawsLamdbaInput!]!) {
  addawsLamdba(input: $input, upsert: true) {
    numUids
  }
}`;
