export default `mutation($input: [AddawsEmrClusterInput!]!) {
  addawsEmrCluster(input: $input, upsert: true) {
    numUids
  }
}`
