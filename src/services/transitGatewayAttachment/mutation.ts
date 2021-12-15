export default `mutation($input: [AddawsTransitGatewayAttachmentInput!]!) {
    addawsTransitGatewayAttachment(input: $input, upsert: true) {
      numUids
    }
  }`