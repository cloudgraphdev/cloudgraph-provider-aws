export default `mutation($input: [Addaws_ebsInput!]!) {
  addaws_ebs(input: $input, upsert: true) {
    numUids
  }
}`
