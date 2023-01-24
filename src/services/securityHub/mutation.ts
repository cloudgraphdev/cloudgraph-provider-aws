export default `mutation($input: [AddawsSecurityHubInput!]!) {
  addawsSecurityHub(input: $input, upsert: true) {
    numUids
  }
}`
