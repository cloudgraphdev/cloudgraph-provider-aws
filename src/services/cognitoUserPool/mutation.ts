export default `mutation($input: [AddawsCognitoUserPoolInput!]!) {
  addawsCognitoUserPool(input: $input, upsert: true) {
    numUids
  }
}
`