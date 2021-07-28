export default `mutation($input: [Addaws_albInput!]!) {
  addaws_alb(input: $input, upsert: true) {
    numUids
  }
}`