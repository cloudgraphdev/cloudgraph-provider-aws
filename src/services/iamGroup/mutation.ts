export default `mutation($input: [AddawsIamGroupInput!]!) {
  addawsIamGroup(input: $input, upsert: true) {
    numUids
  }
}`
