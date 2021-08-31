import CloudGraph, { Service, Opts, ProviderData } from '@cloudgraph/sdk'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import AWS from 'aws-sdk'
import chalk from 'chalk'
import { print } from 'graphql'
import STS from 'aws-sdk/clients/sts'
import { isEmpty } from 'lodash'
import path from 'path'

// import AwsSubnet from './subnet'
import ALB from './alb'
import AwsInternetGateway from './igw'
import AwsKms from './kms'
import AwsSecurityGroup from './securityGroup'
import AwsTag from './tag'
import CloudWatch from './cloudwatch'
import EBS from './ebs'
import EC2 from './ec2'
import EIP from './eip'
import ELB from './elb'
import Lambda from './lambda'
import NATGateway from './natGateway'
import NetworkInterface from './networkInterface'
import VPC from './vpc'
import SQS from './sqs'
import APIGatewayRestApi from './apiGatewayRestApi'
import APIGatewayResource from './apiGatewayResource'
import APIGatewayStage from './apiGatewayStage'

import regions from '../enums/regions'
import resources from '../enums/resources'
import services from '../enums/services'
import { Credentials } from '../types'
import { obfuscateSensitiveString } from '../utils/format'
/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export const serviceMap = {
  [services.alb]: ALB,
  [services.apiGatewayResource]: APIGatewayResource,
  [services.apiGatewayRestApi]: APIGatewayRestApi,
  [services.apiGatewayStage]: APIGatewayStage,
  [services.cloudwatch]: CloudWatch,
  [services.ebs]: EBS,
  [services.ec2Instance]: EC2,
  [services.eip]: EIP,
  [services.elb]: ELB,
  [services.igw]: AwsInternetGateway,
  [services.kms]: AwsKms,
  [services.lambda]: Lambda,
  [services.nat]: NATGateway,
  [services.networkInterface]: NetworkInterface,
  [services.sg]: AwsSecurityGroup,
  // [services.subnet]: AwsSubnet, // TODO: Enable when going for ENG-222
  [services.vpc]: VPC,
  [services.sqs]: SQS,
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

  private credentials: Credentials | undefined

  private serviceMap: { [key: string]: any } // TODO: how to type the service map

  private properties: {
    services: { [key: string]: string }
    regions: string[]
    resources: { [key: string]: string }
  }

  async configure(flags: any): Promise<{ [key: string]: any }> {
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
        default: ['us-east-1'],
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

  async getIdentity(): Promise<{ accountId: string }> {
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

  private getCredentials(): Promise<Credentials> {
    return new Promise(async resolve => {
      if (this.credentials) {
        return resolve(this.credentials)
      }
      this.logger.info('Searching for AWS credentials...')
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
      this.logger.success('Found and using the following AWS credentials')
      this.logger.success(
        `profile: ${chalk.underline.green(this.config.profile ?? 'default')}`
      )
      this.logger.success(
        `accessKeyId: ${chalk.underline.green(
          obfuscateSensitiveString(this.credentials.accessKeyId)
        )}`
      )
      this.logger.success(
        `secretAccessKey: ${chalk.underline.green(
          obfuscateSensitiveString(this.credentials.secretAccessKey)
        )}`
      )
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
  private getService(service: string): Service {
    if (!serviceMap[service]) {
      throw new Error(`Service ${service} does not exist for AWS provider`)
    }
    return new serviceMap[service](this)
  }

  /**
   * getData is used to fetch all provider data specified in the config for the provider
   * @param TODO: fill in
   * @returns Promise<any> All provider data
   */
  async getData({ opts }: { opts: Opts }): Promise<ProviderData> {
    let { regions: configuredRegions, resources: configuredResources } =
      this.config
    if (!configuredRegions) {
      configuredRegions = this.properties.regions.join(',')
    } else {
      configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
    }
    if (!configuredResources) {
      configuredResources = Object.values(this.properties.services).join(',')
    }
    const credentials = await this.getCredentials()
    const rawData = []
    const resourceNames: string[] = [
      ...new Set<string>(configuredResources.split(',')),
    ]

    // Get Raw data for services
    for (const resource of resourceNames) {
      const serviceClass = this.getService(resource)
      rawData.push({
        name: resource,
        data: await serviceClass.getData({
          regions: configuredRegions,
          credentials,
          opts,
        }),
      })
    }
    // Handle global tag entities
    const tagRegion = 'aws-global'
    const tags = { name: 'tag', data: { [tagRegion]: [] } }
    for (const { data: entityData } of rawData) {
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
    rawData.push(tags)

    /**
     * Loop through the aws sdk data to format entities and build connections
     * 1. Format data with provider service format function
     * 2. build connections for data with provider service connections function
     * 3. spread new connections over result.connections
     * 4. push the array of formatted entities into result.entites
     */
    const result: ProviderData = {
      entities: [],
      connections: {},
    }
    const { accountId } = await this.getIdentity()
    for (const serviceData of rawData) {
      const serviceClass = this.getService(serviceData.name)
      const entities: any[] = []
      for (const region of Object.keys(serviceData.data)) {
        const data = serviceData.data[region]
        data.forEach((service: any) => {
          entities.push(
            serviceClass.format({
              service,
              region,
              account: accountId,
            })
          )
          if (typeof serviceClass.getConnections === 'function') {
            result.connections = {
              ...result.connections,
              ...serviceClass.getConnections({
                service,
                region,
                account: accountId,
                data: rawData,
              }),
            }
          }
        })
        result.entities.push({
          name: serviceData.name,
          mutation: serviceClass.mutation,
          data: entities,
        })
      }
    }
    return result
  }
}
