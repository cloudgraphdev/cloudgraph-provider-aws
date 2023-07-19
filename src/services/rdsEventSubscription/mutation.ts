export default `mutation($input: [AddawsRdsEventSubscriptionInput!]!) {
  addawsRdsEventSubscription(input: $input, upsert: true) {
    numUids
  }
}`;