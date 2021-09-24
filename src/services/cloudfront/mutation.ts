export default `mutation($input: [AddawsCloudfrontInput!]!) {
  addawsCloudfront(input: $input, upsert: true) {
    numUids
  }
}`