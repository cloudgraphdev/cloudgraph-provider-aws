export default `mutation($input: [AddawsVpcEndpointInput!]!) {
    addawsVpcEndpoint(input: $input, upsert: true) {
        numUids
    }
}`
