export default `mutation($input: [AddawsCloudwatchDashboardInput!]!) {
  addawsCloudwatchDashboard(input: $input, upsert: true) {
    numUids
  }
}`
