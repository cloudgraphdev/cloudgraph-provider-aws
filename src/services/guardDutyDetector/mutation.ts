export default `mutation($input: [AddawsGuardDutyDetectorInput!]!) {
  addawsGuardDutyDetector(input: $input, upsert: true) {
    numUids
  }
}`;