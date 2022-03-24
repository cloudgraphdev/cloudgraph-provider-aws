export default `mutation($input: [AddawsRdsClusterSnapshotInput!]!) {
  addawsRdsClusterSnapshot(input: $input, upsert: true) {
    numUids
  }
}`;