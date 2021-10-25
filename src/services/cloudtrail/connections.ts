// import isEmpty from 'lodash/isEmpty'

// import { ServiceConnection } from '@cloudgraph/sdk';
// import { Trail } from 'aws-sdk/clients/cloudtrail';
// import { TagMap } from '../../types';
// import { s3BucketArn } from '../../utils/generateArns';

// import services from '../../enums/services';
// import { gets3BucketId } from '../../utils/ids';

// /**
//  * CloudTrail
//  */

// export default ({
//   service: cloudTrail,
//   data,
//   region,
// }: {
//   data: { name: string; data: { [property: string]: any[] } }[]
//   service: Trail & {
//     Tags: TagMap
//     region: string
//   }
//   region: string
// }): { [key: string]: ServiceConnection[] } => {
//   const connections: ServiceConnection[] = []

//   const {
//     TrailARN: id,
//     S3BucketName: s3BucketName,
//     // SnsTopicARN: snsTopicARN,
//     KmsKeyId: kmsKeyId,
//   } = cloudTrail

//   /**
//    * Find S3 bucket
//    * related to the cloudTrail
//    */
//   const s3Buckets = data.find(({ name }) => name === services.s3)
//   const s3Arn = s3BucketArn({name: s3BucketName})
//   if (s3Buckets?.data?.[region]) {
//     const s3BucketInRegion = s3Buckets.data[region].filter(bucket => 
//       s3BucketArn({name: bucket.Name}) === s3Arn
//     )

//     if (!isEmpty(s3BucketInRegion)) {
//       for (const s3 of s3BucketInRegion) {
//         connections.push({
//           id: gets3BucketId(s3.Name),
//           resourceType: services.s3,
//           relation: 'child',
//           field: 's3',
//         })
//       }
//     }
//   }

//   /**
//    * Find KMS
//    * related to the cloudTrail
//    */
//   const kmsKeys = data.find(({ name }) => name === services.kms)
//   if (kmsKeys?.data?.[region]) {
//     const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey => 
//       kmsKey.Arn === kmsKeyId
//     )

//     if (!isEmpty(kmsKeyInRegion)) {
//       for (const kms of kmsKeyInRegion) {
//         connections.push({
//           id: kms.KeyId,
//           resourceType: services.kms,
//           relation: 'child',
//           field: 'kms',
//         })
//       }
//     }
//   }

//   // TODO add Sns Topic connection

//   const asgResult = {
//     [id]: connections,
//   }
//   return asgResult;
// }
