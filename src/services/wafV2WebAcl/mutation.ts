export default `mutation($input: [AddawsWafV2WebAclInput!]!) {
  addawsWafV2WebAcl(input: $input, upsert: true) {
    numUids
  }
}`;