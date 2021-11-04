export default `mutation($input: [AddawsEksClusterInput!]!) {
  addawsEksCluster(input: $input, upsert: true) {
    numUids
  }
}`
