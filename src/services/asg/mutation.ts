export default `mutation($input: [AddawsAsgInput!]!) {
  addawsAsg(input: $input, upsert: true) {
    numUids
  }
}`