export default `mutation($input: [AddawsIamAccessAnalyzerInput!]!) {
  addawsIamAccessAnalyzer(input: $input, upsert: true) {
    numUids
  }
}`
