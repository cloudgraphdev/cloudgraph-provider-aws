export default `mutation($input: [AddawsRDSDBClusterInput!]!) {
  addawsRDSDBCluster(input: $input, upsert: true) {
    numUids
  }
}`
