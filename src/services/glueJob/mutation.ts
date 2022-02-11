export default `mutation($input: [AddawsGlueJobInput!]!) {
  addawsGlueJob(input: $input, upsert: true) {
    numUids
  }
}`;