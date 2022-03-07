export default `mutation($input: [AddawsSageMakerNotebookInstanceInput!]!) {
  addawsSageMakerNotebookInstance(input: $input, upsert: true) {
    numUids
  }
}`;