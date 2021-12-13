export default `mutation($input: [AddawsCustomerGatewayInput!]!) {
    addawsCustomerGateway(input: $input, upsert: true) {
    numUids
    }
}`