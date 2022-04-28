export default `mutation($input: [AddawsBillingInput!]!) {
  addawsBilling(input: $input, upsert: true) {
    numUids
  }
}`
