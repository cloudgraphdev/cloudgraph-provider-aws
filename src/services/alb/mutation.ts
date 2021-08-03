export default `mutation($input: [AddawsAlbInput!]!) {
  addawsAlb(input: $input, upsert: true) {
    numUids
  }
}`