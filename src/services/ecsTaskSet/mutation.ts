export default `mutation($input: [AddawsEcsTaskSetInput!]!) {
  addawsEcsTaskSet(input: $input, upsert: true) {
    numUids
  }
}`