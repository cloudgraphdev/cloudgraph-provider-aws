export default `mutation($input: [AddawsAccountInput!]!) {
  addawsAccount(input: $input, upsert: true) {
    numUids
  }
}`
