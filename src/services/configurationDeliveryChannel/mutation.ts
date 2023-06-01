export default `mutation($input: [AddawsConfigurationDeliveryChannelInput!]!) {
    addawsConfigurationDeliveryChannel(input: $input, upsert: true) {
    numUids
    }
}`
