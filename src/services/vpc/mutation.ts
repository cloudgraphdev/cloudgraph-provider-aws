export default `mutation($input: [AddvpcInput!]!) {
  addvpc(input: $input, upsert: true) {
    numUids
  }
}`