export default `mutation($input: [AddawsEcsTaskDefinitionInput!]!) {
  addawsEcsTaskDefinition(input: $input, upsert: true) {
    numUids
  }
}`