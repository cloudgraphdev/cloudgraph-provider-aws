export default `mutation($input: [AddalbInput!]!) {
  addalb(input: $input, upsert: true) {
    numUids
  }
}`