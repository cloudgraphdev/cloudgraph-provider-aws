export default `mutation($input: [AddawsCloudFormationStackInput!]!) {
  addawsCloudFormationStack(input: $input, upsert: true) {
    numUids
  }
}`