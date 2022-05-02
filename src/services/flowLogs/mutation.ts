export default `mutation($input: [AddawsFlowLogInput!]!) {
  addawsFlowLog(input: $input, upsert: true) {
    numUids
  }
}`
