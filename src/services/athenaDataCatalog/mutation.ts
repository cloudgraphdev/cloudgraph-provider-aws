export default `mutation($input: [AddawsAthenaDataCatalogInput!]!) {
  addawsAthenaDataCatalog(input: $input, upsert: true) {
    numUids
  }
}`;