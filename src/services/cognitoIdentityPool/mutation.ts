export default `mutation($input: [AddawsCognitoIdentityPoolInput!]!) {
  addawsCognitoIdentityPool(input: $input, upsert: true) {
    numUids
  }
}
`