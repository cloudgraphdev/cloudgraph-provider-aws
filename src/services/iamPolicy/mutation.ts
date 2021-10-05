export default `mutation($input: [AddawsIamPolicyInput!]!) {
  addawsIamPolicy(input: $input, upsert: true) {
    numUids
  }
}`
