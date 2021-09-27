export default `mutation($input: [AddawsAppSyncInput!]!) {
  addawsAppSync(input: $input, upsert: true) {
    numUids
  }
}`