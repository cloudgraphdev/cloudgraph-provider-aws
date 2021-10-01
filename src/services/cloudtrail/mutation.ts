export default `mutation($input: [AddawsCloudTrailInput!]!) {
  addawsCloudTrail(input: $input, upsert: true) {
    numUids
  }
}`
