export default `mutation($input: [AddawsSystemsManagerParameterInput!]!) {
  addawsSystemsManagerParameter(input: $input, upsert: true) {
    numUids
  }
}`;
