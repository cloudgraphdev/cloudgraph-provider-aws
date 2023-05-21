export default `mutation($input: [AddawsSystemManagerAssociationInput!]!) {
  addawsSystemManagerAssociation(input: $input, upsert: true) {
    numUids
  }
}`