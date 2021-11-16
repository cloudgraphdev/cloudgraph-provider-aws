export default `mutation($input: [AddawsElastiCacheClusterInput!]!) {
  addawsElastiCacheCluster(input: $input, upsert: true) {
    numUids
  }
}`