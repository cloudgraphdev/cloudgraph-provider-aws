export default `mutation($input: [AddawsIgwInput!]!) {
  addawsIgw(input: $input, upsert: true) {
    numUids
  }
}`