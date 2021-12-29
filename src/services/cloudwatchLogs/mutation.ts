export default `mutation($input: [AddawsCloudwatchLogInput!]!) {
    addawsCloudwatchLog(input: $input, upsert: true) {
      numUids
    }
  }`