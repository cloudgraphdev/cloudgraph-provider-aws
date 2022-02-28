export default `mutation($input: [AddawsSystemsManagerInstanceInput!]!) {
  addawsSystemsManagerInstance(input: $input, upsert: true) {
    numUids
  }
}`;