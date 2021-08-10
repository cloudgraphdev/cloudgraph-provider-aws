import AWS from 'aws-sdk'
import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { print } from 'graphql'
import CloudGraph, { Service, Opts } from '@cloudgraph/sdk'
import STS from 'aws-sdk/clients/sts'
import services from '../enums/services'
import resources from '../enums/resources'
import regions from '../enums/regions'
import ALB from './alb'
import AwsInternetGateway from './igw'
import CloudWatch from './cloudwatch'
import EC2 from './ec2'
import EIP from './eip'
import AwsKms from './kms'
import Lambda from './lambda'
// import AwsSubnet from './subnet'
import AwsSecurityGroup from './securityGroup'
import VPC from './vpc'
import EBS from './ebs'
import { Credentials } from '../types'

/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export const serviceMap = {
  [services.alb]: ALB,
  [services.cloudwatch]: CloudWatch,
  [services.ec2Instance]: EC2,
  [services.eip]: EIP,
  [services.igw]: AwsInternetGateway,
  [services.kms]: AwsKms,
  [services.lambda]: Lambda,
  [services.sg]: AwsSecurityGroup,
  // [services.subnet]: AwsSubnet, // TODO: Enable when going for ENG-222
  [services.vpc]: VPC,
  [services.ebs]: EBS,
}

export const enums = {
  services,
  regions,
  resources,
}
// TODO: Create base class in SDK for this that sets up inquirer interface
export default class Provider extends CloudGraph.Client {
  constructor(config: any) {
    super(config)
    this.properties = enums
    this.serviceMap = serviceMap
  }

  credentials: Credentials | undefined

  serviceMap: { [key: string]: any } // TODO: how to type the service map

  properties: {
    services: { [key: string]: string }
    regions: string[]
    resources: { [key: string]: string }
  }

  async configure(flags: any) {
    const result: { [key: string]: any } = {}
    const answers = await this.interface.prompt([
      {
        type: 'checkbox',
        message: 'Select regions to scan',
        loop: false,
        name: 'regions',
        choices: regions.map((region: string) => ({
          name: region,
        })),
      },
    ])
    this.logger.debug(answers)
    result.regions = answers.regions.join(',')
    if (flags.resources) {
      const answers = await this.interface.prompt([
        {
          type: 'checkbox',
          message: 'Select services to scan',
          loop: false,
          name: 'resources',
          choices: Object.values(services as { [key: string]: string }).map(
            (service: string) => ({
              name: service,
            })
          ),
        },
      ])
      this.logger.debug(answers)
      if (answers.resources.length > 0) {
        result.resources = answers.resources.join(',')
      } else {
        result.resources = Object.values(services).join(',')
      }
    } else {
      result.resources = Object.values(services).join(',')
    }
    return result
  }

  async getIdentity() {
    try {
      const credentials = await this.getCredentials()
      return new Promise((resolve, reject) =>
        new STS({ credentials }).getCallerIdentity((err, data) => {
          if (err) {
            return reject(err)
          }
          return resolve({ accountId: data.Account })
        })
      )
    } catch (e) {
      this.logger.error('There was an error in function getIdentity')
      this.logger.debug(e)
      return { accountId: '' }
    }
  }

  getCredentials(): Promise<Credentials> {
    return new Promise(resolve => {
      if (this.credentials) {
        resolve(this.credentials)
      }
      AWS.config.getCredentials((err: any) => {
        if (err) {
          this.logger.error('There was an error in function getCredentials')
          this.logger.debug(err)
          throw new Error(
            'Unable to find Credentials for AWS, They could be stored in env variables or .aws/credentials file'
          )
        } else {
          this.credentials = AWS.config.credentials
          resolve(AWS.config.credentials)
        }
      })
    })
  }

  /**
   * getSchema is used to get the schema for provider
   * @returns A string of graphql sub schemas
   */
  getSchema(): string {
    const typesArray = loadFilesSync(path.join(__dirname), {
      recursive: true,
      extensions: ['graphql'],
    })
    return print(mergeTypeDefs(typesArray))
  }

  /**
   * Factory function to return AWS service classes based on input service
   * @param service an AWS service that is listed within the service map (current supported services)
   * @returns Instance of an AWS service class to interact with that AWS service
   */
  getService(service: string): Service {
    if (!serviceMap[service]) {
      throw new Error(`Service ${service} does not exist for AWS provider`)
    }
    return new serviceMap[service](this)
  }

  /**
   * getData is used to fetch all provider data specificed in the config for the provider
   * @param TODO: fill in
   * @returns Promise<any> All provider data
   */
  async getData({
    opts,
  }: {
    opts: Opts
  }): Promise<Array<{ name: string; data: any[] }>> {
    let { regions, resources } = this.config
    if (!regions) {
      regions = this.properties.regions.join(',')
    }
    if (!resources) {
      resources = Object.values(this.properties.services).join(',')
    }
    const credentials = await this.getCredentials()
    const result = []
    const resourceNames = resources.split(',')
    for (const resource of resourceNames) {
      const serviceClass = this.getService(resource as any)
      result.push({
        name: resource,
        data: await serviceClass.getData({ regions, credentials, opts }),
      })
    }
    return result
  }
}

// testFunc()
