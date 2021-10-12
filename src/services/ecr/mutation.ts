export default `mutation($input: [AddawsEcrInput!]!) {
  addawsEcr(input: $input, upsert: true) {
    numUids
  }
}`