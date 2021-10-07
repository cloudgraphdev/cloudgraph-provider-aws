export default `mutation($input: [AddawsCloudtrailInput!]!) {
  addawsCloudtrail(input: $input, upsert: true) {
    numUids
  }
}`
