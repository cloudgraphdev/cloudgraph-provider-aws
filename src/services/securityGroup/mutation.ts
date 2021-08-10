export default `mutation($input: [AddawsSecurityGroupInput!]!) {
  addawsSecurityGroup(input: $input, upsert: true) {
    numUids
  }
}`;
