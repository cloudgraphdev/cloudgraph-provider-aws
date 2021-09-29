export default `mutation($input: [AddawsCloudFormationStackSetInput!]!) {
  addawsCloudFormationStackSet(input: $input, upsert: true) {
    numUids
  }
}`