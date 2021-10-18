export default `mutation($input: [AddawsRdsDbInstanceInput!]!) {
  addawsRdsDbInstance(input: $input, upsert: true) {
    numUids
  }
}`
