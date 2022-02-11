export default `mutation($input: [AddawsCodebuildInput!]!) {
  addawsCodebuild(input: $input, upsert: true) {
    numUids
  }
}`;