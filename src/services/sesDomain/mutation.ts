export default `mutation($input: [AddawsSesDomainInput!]!) {
  addawsSesDomain(input: $input, upsert: true) {
    numUids
  }
}`
