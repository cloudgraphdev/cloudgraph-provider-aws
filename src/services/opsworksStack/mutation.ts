export default `mutation($input: [AddawsOpsWorksStackInput!]!) {
  addawsOpsWorksStack(input: $input, upsert: true) {
    numUids
  }
}`