export default `mutation($input: [AddawsSecretsManagerInput!]!) {
  addawsSecretsManager(input: $input, upsert: true) {
    numUids
  }
}`
