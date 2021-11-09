export default `mutation($input: [AddawsElastiCacheReplicationGroupInput!]!) {
  addawsElastiCacheReplicationGroup(input: $input, upsert: true) {
    numUids
  }
}`