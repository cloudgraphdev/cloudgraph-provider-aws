export default `mutation($input: [AddawsRDSDbInstanceInput!]!) {
  addawsRDSDbInstance(input: $input, upsert: true) {
    numUids
  }
}`
