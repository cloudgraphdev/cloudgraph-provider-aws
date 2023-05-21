export default `mutation($input: [AddawsSsmActivationInput!]!) {
  addawsSsmActivation(input: $input, upsert: true) {
    numUids
  }
}`