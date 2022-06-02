export default `mutation($input: [AddawsVpcPeeringConnectionInput!]!) {
    addawsVpcPeeringConnection(input: $input, upsert: true) {
      numUids
    }
  }`