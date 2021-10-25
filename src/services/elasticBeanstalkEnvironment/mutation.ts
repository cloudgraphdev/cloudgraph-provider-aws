export default `mutation($input: [AddawsElasticBeanstalkEnvInput!]!) {
  addawsElasticBeanstalkEnv(input: $input, upsert: true) {
    numUids
  }
}`;
