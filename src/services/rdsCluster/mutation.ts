export default `mutation($input: [AddawsrdsClusterInput!]!) {
  addawsrdsCluster(input: $input, upsert: true) {
    numUids
  }
}`
