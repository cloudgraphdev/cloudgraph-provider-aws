export default `mutation($input: [AddawsApiGatewayUsagePlanInput!]!) {
  addawsApiGatewayUsagePlan(input: $input, upsert: true) {
    numUids
  }
}`
