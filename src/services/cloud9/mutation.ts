export default `mutation($input: [AddawsCloud9EnvironmentInput!]!) {
  addawsCloud9Environment(input: $input, upsert: true) {
    numUids
  }
}`