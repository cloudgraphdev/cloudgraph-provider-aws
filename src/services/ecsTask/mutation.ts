export default `mutation($input: [AddawsEcsTaskInput!]!) {
  addawsEcsTask(input: $input, upsert: true) {
    numUids
  }
}`