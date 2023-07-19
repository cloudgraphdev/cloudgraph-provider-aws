export default `mutation($input: [AddawsRdsGlobalClusterInput!]!) {
  addawsRdsGlobalCluster(input: $input, upsert: true) {
    numUids
  }
}`
