export default `mutation($input: [AddawsSageMakerProjectInput!]!) {
  addawsSageMakerProject(input: $input, upsert: true) {
    numUids
  }
}`;