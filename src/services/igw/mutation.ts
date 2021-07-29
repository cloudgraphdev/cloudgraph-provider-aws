export default `mutation($input: [Addaws_igwInput!]!) {
  addaws_igw(input: $input, upsert: true) {
    numUids
  }
}`