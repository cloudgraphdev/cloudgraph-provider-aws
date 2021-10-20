export default `mutation($input: [AddawsIamServerCertificateInput!]!) {
  addawsIamServerCertificate(input: $input, upsert: true) {
    numUids
  }
}`
