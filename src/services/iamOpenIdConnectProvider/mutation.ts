export default `mutation($input: [AddawsIamOpenIdConnectProviderInput!]!) {
  addawsIamOpenIdConnectProvider(input: $input, upsert: true) {
    numUids
  }
}`
