export default `mutation($input: [AddawsEmrStepInput!]!) {
  addawsEmrStep(input: $input, upsert: true) {
    numUids
  }
}`
