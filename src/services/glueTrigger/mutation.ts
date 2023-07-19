export default `mutation($input: [AddawsGlueTriggerInput!]!) {
  addawsGlueTrigger(input: $input, upsert: true) {
    numUids
  }
}`;
