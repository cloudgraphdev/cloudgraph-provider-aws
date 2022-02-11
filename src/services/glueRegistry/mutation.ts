export default `mutation($input: [AddawsGlueRegistryInput!]!) {
  addawsGlueRegistry(input: $input, upsert: true) {
    numUids
  }
}`;