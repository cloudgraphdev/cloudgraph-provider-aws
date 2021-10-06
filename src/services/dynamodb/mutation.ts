export default `mutation($input: [AddawsDynamoDbTableInput!]!) {
  addawsDynamoDbTable(input: $input, upsert: true) {
    numUids
  }
}`