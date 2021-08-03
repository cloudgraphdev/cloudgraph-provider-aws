export default `mutation($input: [AddawsEc2Input!]!) {
  addawsEc2(input: $input, upsert: true) {
    numUids
  }
}`