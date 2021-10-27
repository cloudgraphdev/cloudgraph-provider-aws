export default `mutation($input: [AddawsRedshiftClusterInput!]!) {
  addawsRedshiftCluster(input: $input, upsert: true) {
    numUids
  }
}`
