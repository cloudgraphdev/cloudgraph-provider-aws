export default `mutation($input: [AddawsS3Input!]!) {
  addawsS3(input: $input, upsert: true) {
    numUids
  }
}`
