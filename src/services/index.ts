import AWS from 'aws-sdk'
import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { print } from 'graphql'
import CloudGraph, { Service, Opts } from '@cloudgraph/sdk'
import STS from 'aws-sdk/clients/sts'
import { isEmpty } from 'lodash'
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
import AwsTag from './tag'
// import AwsSubnet from './subnet'
import AwsSecurityGroup from './securityGroup'
import VPC from './vpc'
import EBS from './ebs'
import NetworkInterface from './networkInterface'
import ELB from './elb'
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
  [services.networkInterface]: NetworkInterface,
  [services.elb]: ELB,
  tag: AwsTag,
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
    this.logger.info('Searching for AWS credentials...')
    return new Promise(async resolve => {
      if (this.credentials) {
        return resolve(this.credentials)
      }
      switch (true) {
        case this.config.profile &&
          this.config.profile !== 'default' &&
          this.config.role &&
          this.config.role !== '': {
          const sts = new AWS.STS()
          await new Promise<void>(resolve => {
            sts.assumeRole(
              {
                RoleArn: this.config.role,
                RoleSessionName: 'CloudGraph',
              },
              (err, data) => {
                if (err) {
                  this.logger.error(
                    `No credentials found for profile: ${this.config.profile} role: ${this.config.role}`
                  )
                  this.logger.debug(err)
                  resolve()
                } else {
                  // successful response
                  const {
                    AccessKeyId: accessKeyId,
                    SecretAccessKey: secretAccessKey,
                    SessionToken: sessionToken,
                  } = data.Credentials
                  const creds = {
                    accessKeyId,
                    secretAccessKey,
                    sessionToken,
                  }
                  AWS.config.update(creds)
                  this.credentials = creds
                  resolve()
                }
              }
            )
          })
          break
        }
        case this.config.profile && this.config.profile !== 'default': {
          try {
            // TODO: how to catch the error from SharedIniFileCredentials when profile doent exist
            const credentials = new AWS.SharedIniFileCredentials({
              profile: this.config.profile,
              callback: (err: any) => {
                if (err) {
                  this.logger.error(
                    `No credentails found for profile ${this.config.profile}`
                  )
                }
              },
            })
            if (credentials) {
              AWS.config.credentials = credentials
              this.credentials = AWS.config.credentials
            }
            break
          } catch (error: any) {
            break
          }
        }
        default: {
          await new Promise<void>(resolve =>
            AWS.config.getCredentials((err: any) => {
              if (err) {
                resolve()
              } else {
                this.credentials = AWS.config.credentials
                resolve()
              }
            })
          )
        }
      }
      if (!this.credentials) {
        this.logger.info('No AWS Credentials found, please enter them manually')
        const answers = await this.interface.prompt([
          {
            type: 'input',
            message: 'Please input a valid accessKeyId',
            name: 'accessKeyId',
          },
          {
            type: 'input',
            message: 'Please input a valid secretAccessKey',
            name: 'secretAccessKey',
          },
        ])
        if (answers?.accessKeyId && answers?.secretAccessKey) {
          this.credentials = answers
        } else {
          this.logger.error('Cannot scan AWS without credentials')
          throw new Error()
        }
      }
      resolve(this.credentials)
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
    // Handle global tag entities
    const tagRegion = 'aws-global'
    const tags = { name: 'tag', data: { [tagRegion]: [] } }
    for (const { data: entityData } of result) {
      for (const region of Object.keys(entityData)) {
        const dataAtRegion = entityData[region]
        dataAtRegion.forEach(singleEntity => {
          if (!isEmpty(singleEntity.Tags)) {
            for (const [key, value] of Object.entries(singleEntity.Tags)) {
              if (
                !tags.data[tagRegion].find(({ id }) => id === `${key}:${value}`)
              ) {
                tags.data[tagRegion].push({ id: `${key}:${value}`, key, value })
              }
            }
          }
        })
      }
    }
    result.push(tags)
    return result
  }
}

// grab tags at the end
// 1. create schema for tags {id: key:value @id, key: ... @id, value: ... @id}
// 1. loop through the result and collect all tags
// 2. push {name: tag, data: {awsGlobal: [{key, value}]} } to result
// 3. push into result.entities {name: tag, data: [{key, value}]}
// 4. getConnections take each tag, look in each service for if that tag exists there, form connection

// testFunc()
