export default `mutation($input: [AddawsManagedPrefixListInput!]!) {
    addawsManagedPrefixList(input: $input, upsert: true) {
        numUids
    }
}`
