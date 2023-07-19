export default `mutation($input: [AddawsCodePipelineWebhookInput!]!) {
  addawsCodePipelineWebhook(input: $input, upsert: true) {
    numUids
  }
}`;
