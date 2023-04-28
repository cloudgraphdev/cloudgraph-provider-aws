export default `mutation($input: [AddawsMskClusterInput!]!) {
  addawsMskCluster(input: $input, upsert: true) {
    numUids
  }
}`