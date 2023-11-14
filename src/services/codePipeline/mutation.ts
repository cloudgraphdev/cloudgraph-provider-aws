export default `mutation($input: [AddawsCodePipelineInput!]!) {
  addawsCodePipeline(input: $input, upsert: true) {
    numUids
  }
}`;
