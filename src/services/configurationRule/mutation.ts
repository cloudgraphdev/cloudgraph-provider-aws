export default `mutation($input: [AddawsConfigurationRuleInput!]!) {
    addawsConfigurationRule(input: $input, upsert: true) {
    numUids
    }
}`
