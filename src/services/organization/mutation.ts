export default `mutation($input: [AddawsOrganizationInput!]!) {
    addawsOrganization(input: $input, upsert: true) {
      numUids
    }
  }`
  