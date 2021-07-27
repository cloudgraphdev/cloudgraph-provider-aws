export default `mutation($input: [Addaws_cloudwatchInput!]!) {
  addaws_cloudwatch(input: $input, upsert: true) {
    numUids
  }
}`