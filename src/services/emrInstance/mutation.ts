export default `mutation($input: [AddawsEmrInstanceInput!]!) {
  addawsEmrInstance(input: $input, upsert: true) {
    numUids
  }
}`
