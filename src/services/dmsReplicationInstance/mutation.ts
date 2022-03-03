export default `mutation($input: [AddawsDmsReplicationInstanceInput!]!) {
  addawsDmsReplicationInstance(input: $input, upsert: true) {
    numUids
  }
}`;