export default `mutation($input: [Addec2Input!]!) {
  addec2(input: $input, upsert: true) {
    numUids
  }
}`