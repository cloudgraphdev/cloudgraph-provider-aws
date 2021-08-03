export default `mutation($input: [AddawsCloudwatchInput!]!) {
  addawsCloudwatch(input: $input, upsert: true) {
    numUids
  }
}`