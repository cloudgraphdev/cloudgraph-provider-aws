export default `mutation($input: [AddawsCodeCommitRepositoryInput!]!) {
  addawsCodeCommitRepository(input: $input, upsert: true) {
    numUids
  }
}`;
