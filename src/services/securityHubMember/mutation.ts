export default `mutation($input: [AddawsSecurityHubMemberInput!]!) {
  addawsSecurityHubMember(input: $input, upsert: true) {
    numUids
  }
}`
