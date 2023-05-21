export default `mutation($input: [AddawsSsmAssociationInput!]!) {
  addawsSsmAssociation(input: $input, upsert: true) {
    numUids
  }
}`