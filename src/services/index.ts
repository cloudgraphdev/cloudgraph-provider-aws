import {loadFilesSync} from '@graphql-tools/load-files'
import { Service, Opts } from 'cloud-graph-sdk'
import STS from 'aws-sdk/clients/sts'
import services from '../enums/services'
import resources from '../enums/resources'
import regions from '../enums/regions'
import ALB from './alb'
import CloudWatch from './cloudWatch'
import EC2 from './ec2'
import VPC from './vpc'
import { Credentials } from '../types'
import { getKeyByValue, getAccountId } from '../utils'

const path = require('path')
const AWS = require('aws-sdk')

/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export const serviceMap = {
  [services.alb]: ALB,
  [services.ec2Instance]: EC2,
  [services.vpc]: VPC,
  [services.cloudwatch]: CloudWatch,
}

/**
 * Factory function to return AWS service classes based on input service
 * @param service an AWS service that is listed within the service map (current supported services)
 * @returns Instance of an AWS service class to interact with that AWS service
 */
export function serviceFactory(service: string): Service {
  if (!serviceMap[service]) {
    throw new Error(`Service ${service} does not exist for AWS provider`)
  }
  return new serviceMap[service](this)
}

// export function getCredentials(): Promise<Credentials> {
//   return new Promise(resolve => {
//     AWS.config.getCredentials((err: any) => {
//       if (err) {
//         this.log(err)
//         throw new Error('Unable to find Credentials for AWS, They could be stored in env variables or .aws/credentials file')
//       } else {
//         resolve(AWS.config.credentials)
//       }
//     })
//   })
// }

// export async function getAccountId({ credentials }): Promise<any> {
//   try {
//     return new Promise((resolve, reject) =>
//       new STS({ credentials }).getCallerIdentity((err, data) => {
//         if (err) {
//           return reject(err)
//         }
//         return resolve({ accountId: data.Account })
//       })
//     )
//   } catch (e) {
//     return { accountId: '' }
//   }
// }

export async function getProviderData({
  regions,
  resources,
  credentials,
  opts
}: {regions: string, resources: string, credentials: Credentials, opts: Opts}): Promise<any> {
  const result = []
  const resourceNames = resources.split(',')
  for (const resource of resourceNames) {
    const serviceClass = this.getService(resource)
    result.push({
      name: resource,
      data: await serviceClass.getData({ regions, credentials, opts })
    })
  }
  return result
}

export function getGraphqlSchema(opts: Opts) {
  const typesArray = loadFilesSync(path.join(__dirname), {recursive: true, extensions: ['graphql']})
  return typesArray
}
// async function testFunc() {
//   // const test = createServiceClass('alb')
//   // console.log(await test.getData({ regions: 'us-east-1', credentials: await getCredentials()}))
//   const result = {
//     entities: [],
//     connections: {}
//   }
//   const { accountId } = await getAccountId({ credentials: await getCredentials()})
//   const awsData = await getProviderData({ regions: 'us-east-1', resources: 'alb,ec2Instance,vpc', credentials: await getCredentials()})
//   for (const serviceData of awsData) {
//     const serviceClass = serviceFactory(serviceData.name)
//     const entities = []
//     for (const region in serviceData.data) {
//       const data = serviceData.data[region]
//       const entities = []
//       for (const serviceInstance of data) {
//         entities.push(serviceClass.format({service: serviceInstance, region, account: accountId}))
//         if (serviceClass.getConnections && typeof serviceClass.getConnections === 'function') {
//           result.connections = {...result.connections, ...serviceClass.getConnections({service: serviceInstance, region, account: accountId, data: awsData})}
//         }
//       }
//     }
//     result.entities.push({name: serviceData.name, data: entities})
//   }
//   for (const entity of result.entities) {
//     const { name, data } = entity
//     const connectedData = data.map(service => {
//       console.log(`connecting service: ${name}`)
//       console.log(`service arn is: ${service.arn}`)
//       const connections = result.connections[service.arn]
//       const connectedEntity = {
//         ...service
//       }
//       if (connections) {
//         for (const connection of connections) {
//           console.log(`searching for ${connection.resourceType} entity data to make connection between ${name} && ${connection.resourceType}`)
//           const entityData = result.entities.find(({name}) => name === connection.resourceType)
//           if (entityData && entityData.data) {
//             // console.log('found entities for connection')
//             // console.log(entityData)
//             const entityForConnection = entityData.data.find(({id}) => connection.id === id)
//             // console.log('found connection entity')
//             // console.log(entityForConnection)
//             connectedEntity[getKeyByValue(services, connection.resourceType)] = entityForConnection
//             console.log(connectedEntity)
//           }
//         }
//       }
//       return connectedData
//     })
//   }
//   // console.log(JSON.stringify(result))
// }

export const enums = {
  services,
  regions,
  resources
}

export default class Provider {
  constructor(config: any) {
    this.logger = config.logger
    this.config = config.provider
    this.properties = enums
    this.serviceMap = serviceMap
  }
  logger: any
  config: any
  serviceMap: {[key: string]: any} // TODO: how to type the service map
  properties: {services: {[key: string]: string}, regions: string[], resources: {[key: string]: string}}

  async getIdentity({credentials}) {
    try {
      return new Promise((resolve, reject) =>
        new STS({ credentials }).getCallerIdentity((err, data) => {
          if (err) {
            return reject(err)
          }
          return resolve({ accountId: data.Account })
        })
      )
    } catch (e) {
      return { accountId: '' }
    }
  }

  getCredentials(): Promise<Credentials> {
    return new Promise(resolve => {
      AWS.config.getCredentials((err: any) => {
        if (err) {
          this.logger.debug(err)
          throw new Error('Unable to find Credentials for AWS, They could be stored in env variables or .aws/credentials file')
        } else {
          resolve(AWS.config.credentials)
        }
      })
    })
  }

  getSchema() {
    const typesArray = loadFilesSync(path.join(__dirname), {recursive: true, extensions: ['graphql']})
    return typesArray
  }

  getService(service: string): Service {
    if (!serviceMap[service]) {
      throw new Error(`Service ${service} does not exist for AWS provider`)
    }
    return new serviceMap[service](this)
  }

  async getData({
    regions,
    resources,
    credentials,
    opts
  }: {regions: string, resources: string, credentials: Credentials, opts: Opts}) {
    const result = []
    const resourceNames = resources.split(',')
    for (const resource of resourceNames) {
      const serviceClass = this.getService(resource)
      result.push({
        name: resource,
        data: await serviceClass.getData({ regions, credentials, opts })
      })
    }
    return result
  }
}

// testFunc()