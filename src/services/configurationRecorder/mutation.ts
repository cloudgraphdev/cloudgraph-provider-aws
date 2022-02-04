export default `mutation($input: [AddawsConfigurationRecorderInput!]!) {
    addawsConfigurationRecorder(input: $input, upsert: true) {
    numUids
    }
}`
