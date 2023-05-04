export default `mutation($input: [AddawsOpsWorksInstanceInput!]!) {
  addawsOpsWorksInstance(input: $input, upsert: true) {
    numUids
  }
}`