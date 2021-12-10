export default `mutation($input: [AddawsVpnGatewayInput!]!) {
    addawsVpnGateway(input: $input, upsert: true) {
        numUids
    }
}`
