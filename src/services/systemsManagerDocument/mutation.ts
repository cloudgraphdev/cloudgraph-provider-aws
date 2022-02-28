export default `mutation($input: [AddawsSystemsManagerDocumentInput!]!) {
  addawsSystemsManagerDocument(input: $input, upsert: true) {
    numUids
  }
}`;