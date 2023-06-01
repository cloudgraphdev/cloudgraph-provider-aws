export default `mutation($input: [AddawsSesReceiptRuleSetInput!]!) {
  addawsSesReceiptRuleSet(input: $input, upsert: true) {
    numUids
  }
}`
