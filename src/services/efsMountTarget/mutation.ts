export default `mutation($input: [AddawsEfsMountTargetInput!]!) {
  addawsEfsMountTarget(input: $input, upsert: true) {
    numUids
  }
}`