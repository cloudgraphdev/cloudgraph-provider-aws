export default `mutation($input: [AddawsRdsDbProxiesInput!]!) {
  addawsRdsDbProxies(input: $input, upsert: true) {
    numUids
  }
}`;