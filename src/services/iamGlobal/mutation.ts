export default `mutation($input: [AddawsIamGlobalInput!]!) {
  addawsIamGlobal(input: $input, upsert: true) {
    numUids
  }
}`
