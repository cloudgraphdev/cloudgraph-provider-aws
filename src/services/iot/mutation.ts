export default `mutation($input: [AddawsIotThingAttributeInput!]!) {
  addawsIotThingAttribute(input: $input, upsert: true) {
    numUids
  }
}`;
