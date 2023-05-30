export default `mutation($input: [AddawsCloudwatchEventRuleInput!]!) {
  addawsCloudwatchEventRule(input: $input, upsert: true) {
    numUids
  }
}`
