export default `mutation($input: [AddawsApiGatewayStageInput!]!) {
  addawsApiGatewayStage(input: $input, upsert: true) {
    numUids
  }
}`