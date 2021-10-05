export default `mutation($input: [AddawsIamRoleInput!]!) {
  addawsIamRole(input: $input, upsert: true) {
    numUids
  }
}`
