export default `mutation($input: [AddawsRouteTableInput!]!) {
  addawsRouteTable(input: $input, upsert: true) {
    numUids
  }
}`
