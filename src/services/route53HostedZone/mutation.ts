export default `mutation($input: [AddawsRoute53HostedZoneInput!]!) {
  addawsRoute53HostedZone(input: $input, upsert: true) {
    numUids
  }
}`
