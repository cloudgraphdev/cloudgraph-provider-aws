export default `mutation($input: [AddawsRDSDBInstanceInput!]!) {
  addawsRDSDBInstance(input: $input, upsert: true) {
    numUids
  }
}`
