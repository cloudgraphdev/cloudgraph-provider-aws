export default `mutation($input: [AddawsElasticSearchDomainInput!]!) {
  addawsElasticSearchDomain(input: $input, upsert: true) {
    numUids
  }
}`;