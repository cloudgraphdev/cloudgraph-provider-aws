export default `mutation($input: [AddawsIamSamlProviderInput!]!) {
  addawsIamSamlProvider(input: $input, upsert: true) {
    numUids
  }
}`
