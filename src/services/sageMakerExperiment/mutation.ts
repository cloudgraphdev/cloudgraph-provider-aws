export default `mutation($input: [AddawsSageMakerExperimentInput!]!) {
  addawsSageMakerExperiment(input: $input, upsert: true) {
    numUids
  }
}`;