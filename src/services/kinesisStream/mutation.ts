export default `mutation($input: [AddawsKinesisStreamInput!]!) {
  addawsKinesisStream(input: $input, upsert: true) {
    numUids
  }
}`;
