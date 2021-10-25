export default `mutation($input: [AddawsEcsClusterInput!]!) {
  addawsEcsCluster(input: $input, upsert: true) {
    numUids
  }
}`