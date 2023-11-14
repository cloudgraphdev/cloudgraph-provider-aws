export default `mutation($input: [AddawsEfsAccessPointInput!]!) {
  addawsEfsAccessPoint(input: $input, upsert: true) {
    numUids
  }
}`
