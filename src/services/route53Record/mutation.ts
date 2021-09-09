export default `mutation($input: [AddawsRoute53RecordInput!]!) {
  addawsRoute53Record(input: $input, upsert: true) {
    numUids
  }
}`
