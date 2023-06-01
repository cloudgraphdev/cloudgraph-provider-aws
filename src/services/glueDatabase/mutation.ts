export default `mutation($input: [AddawsGlueDatabaseInput!]!) {
  addawsGlueDatabase(input: $input, upsert: true) {
    numUids
  }
}`;
