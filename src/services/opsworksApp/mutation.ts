export default `mutation($input: [AddawsOpsWorksAppInput!]!) {
  addawsOpsWorksApp(input: $input, upsert: true) {
    numUids
  }
}`