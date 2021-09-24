export default `mutation($input: [AddawsKinesisFirehoseInput!]!) {
  addawsKinesisFirehose(input: $input, upsert: true) {
    numUids
  }
}`;
