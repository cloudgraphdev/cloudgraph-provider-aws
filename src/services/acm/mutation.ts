export default `mutation($input: [AddawsAcmInput!]!) {
  addawsAcm(input: $input, upsert: true) {
    numUids
  }
}`