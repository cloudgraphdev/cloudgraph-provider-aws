export default `mutation($input: [AddawsIamPasswordPolicyInput!]!) {
  addawsIamPasswordPolicy(input: $input, upsert: true) {
    numUids
  }
}`
