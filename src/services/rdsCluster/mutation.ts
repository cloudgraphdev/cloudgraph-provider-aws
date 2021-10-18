export default `mutation($input: [AddawsRdsClusterInput!]!) {
  addawsRdsCluster(input: $input, upsert: true) {
    numUids
  }
}`
