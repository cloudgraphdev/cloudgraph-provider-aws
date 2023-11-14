export default `mutation($input: [AddawsSystemManagerActivationInput!]!) {
  addawsSystemManagerActivation(input: $input, upsert: true) {
    numUids
  }
}`