export default `mutation($input: [AddawsElasticBeanstalkAppInput!]!) {
  addawsElasticBeanstalkApp(input: $input, upsert: true) {
    numUids
  }
}`;
