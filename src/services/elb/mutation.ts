export default `mutation($input: [AddawsElbInput!]!) {
  addawsElb(input: $input, upsert: true) {
    numUids
  }
}`
