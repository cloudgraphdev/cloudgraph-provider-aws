export default `mutation($input: [AddawsSecurityHubStandardSubscriptionInput!]!) {
  addawsSecurityHubStandardSubscription(input: $input, upsert: true) {
    numUids
  }
}`
