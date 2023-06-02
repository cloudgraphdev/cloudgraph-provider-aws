export default `mutation($input: [AddawsDocdbClusterInput!]!) {
  addawsDocdbCluster(input: $input, upsert: true) {
    numUids
  }
}`
