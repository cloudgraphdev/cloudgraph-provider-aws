export default `mutation($input: [AddawsEcsContainerInput!]!) {
  addawsEcsContainer(input: $input, upsert: true) {
    numUids
  }
}`