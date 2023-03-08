export default `mutation($input: [AddawsEbsSnapshotInput!]!) {
  addawsEbsSnapshot(input: $input, upsert: true) {
    numUids
  }
}`
