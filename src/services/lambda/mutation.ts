export default `mutation($input: [AddawsLambdaInput!]!) {
  addawsLambda(input: $input, upsert: true) {
    numUids
  }
}`
