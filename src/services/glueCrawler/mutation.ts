export default `mutation($input: [AddawsGlueCrawlerInput!]!) {
  addawsGlueCrawler(input: $input, upsert: true) {
    numUids
  }
}`;
