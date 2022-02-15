export default `mutation($input: [AddawsManagedAirflowInput!]!) {
  addawsManagedAirflow(input: $input, upsert: true) {
    numUids
  }
}`;