import CloudGraph, { Service, Opts, ProviderData } from '@cloudgraph/sdk'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import AWS from 'aws-sdk'
import chalk from 'chalk'
import { print } from 'graphql'
import STS from 'aws-sdk/clients/sts'
import { isEmpty, get } from 'lodash'
import path from 'path'

import regions, { regionMap } from '../enums/regions'
import resources from '../enums/resources'
import services from '../enums/services'
import serviceMap from '../enums/serviceMap'
import { Credentials } from '../types'
import { obfuscateSensitiveString } from '../utils/format'
// import { setAwsRetryOptions } from '../utils'
import { sortResourcesDependencies } from '../utils'

const DEFAULT_REGION = 'us-east-1'
const DEFAULT_RESOURCES = Object.values(services).join(',')

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

  private serviceMap: { [key: string]: any } // TODO: how to type the service map

  private properties: {
    services: { [key: string]: string }
    regions: string[]
    resources: { [key: string]: string }
  }

  logSelectedRegionsAndResources(
    regionsToLog: string,
    resourcesToLog: string
  ): void {
    this.logger.info(
      `Regions configured: ${chalk.green(regionsToLog.replace(/,/g, ', '))}`
    )
    this.logger.info(
      `Resources configured: ${chalk.green(resourcesToLog.replace(/,/g, ', '))}`
    )
  }

  async configure(flags: any): Promise<{ [key: string]: any }> {
    const result: { [key: string]: any } = {
      ...this.config,
    }
    const profileAnswer = await this.interface.prompt([
      {
        type: 'input',
        message: 'Please enter the name of the AWS credential profile to load from the shared credentials file',
        name: 'profile',
        default: 'default'
      }
    ])
    // Try to find a users aws credentials so we can request to use them and add the profile to approved list.
    await this.getCredentials(profileAnswer)
    // If we get here, we know we have credentials to use
    const { profile } = profileAnswer
    if (!result.profileApprovedList?.find((val: string) => val === profile)) {
      result.profileApprovedList = [
        ...(result.profileApprovedList ?? []),
        profile,
      ]
    }

    const { regions: regionsAnswer } = await this.interface.prompt([
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
    this.logger.debug(`Regions selected: ${regionsAnswer}`)
    if (!regionsAnswer.length) {
      this.logger.info(
        `No Regions selected, using default region: ${chalk.green(
          DEFAULT_REGION
        )}`
      )
      result.regions = DEFAULT_REGION
    } else {
      result.regions = regionsAnswer.join(',')
    }

    // Prompt for resources if flag set
    if (flags.resources) {
      const { resources: resourcesAnswer } = await this.interface.prompt([
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
      this.logger.debug(resourcesAnswer)
      if (resourcesAnswer.length > 0) {
        result.resources = resourcesAnswer.join(',')
      } else {
        result.resources = DEFAULT_RESOURCES
      }
    } else {
      result.resources = DEFAULT_RESOURCES
    }
    const confettiBall = String.fromCodePoint(0x1f38a) // confetti ball emoji
    this.logger.success(
      `${confettiBall} ${chalk.green(
        'AWS'
      )} configuration successfully completed ${confettiBall}`
    )
    this.logSelectedRegionsAndResources(result.regions, result.resources)
    return result
  }

  async getIdentity({ profile, role }: { profile: string, role: string }): Promise<{ accountId: string }> {
    try {
      const credentials = await this.getCredentials({ profile, role })
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

  private getCredentials({ profile, role }: { profile: string, role: string }): Promise<Credentials> {
    return new Promise(async resolveCreds => {
      // If we have keys set in the config file, just use them
      if (this.config.accessKeyId && this.config.secretAccessKey) {
        return {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey,
        }
      }
      /**
       * Tries to find creds in priority order
       * 1. if they have configured a roleArn and profile assume that role using STS
       * 2. if they have configured a profile, assume that profile from ~/.aws/credentials
       * 3. if they have not configured either of the above, assume profile = default from ~/.aws/credentials
       */
      this.logger.info('Searching for AWS credentials...')
      let credentials
      switch (true) {
        case profile && profile !== 'default' && role && role !== '': {
          const sts = new AWS.STS()
          credentials = await new Promise<Credentials>(resolve => {
            sts.assumeRole(
              {
                RoleArn: role,
                RoleSessionName: 'CloudGraph',
              },
              (err, data) => {
                if (err) {
                  this.logger.error(
                    `No credentials found for profile: ${profile} role: ${role}`
                  )
                  this.logger.debug(err)
                  resolve(null)
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
                  resolve(creds)
                }
              }
            )
          })
          break
        }
        case profile && profile !== 'default': {
          try {
            // TODO: how to catch the error from SharedIniFileCredentials when profile doent exist
            credentials = new AWS.SharedIniFileCredentials({
              profile: profile,
              callback: (err: any) => {
                if (err) {
                  this.logger.error(
                    `No credentails found for profile ${profile}`
                  )
                }
              },
            })
            if (credentials) {
              AWS.config.credentials = credentials
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
                credentials = AWS.config.credentials
                resolve()
              }
            })
          )
        }
      }
      if (!credentials) {
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
          credentials = answers
        } else {
          this.logger.error('Cannot scan AWS without credentials')
          throw new Error()
        }
      } else {
        const profileName = profile || 'default'
        if (
          !this.config?.profileApprovedList?.find(
            (val: string) => val === profileName
          )
        ) {
          // Confirm the found credentials are ok to use
          const { approved } = await this.interface.prompt([
            {
              type: 'confirm',
              message: `CG found AWS credentials with accessKeyId: ${chalk.green(
                obfuscateSensitiveString(credentials.accessKeyId)
              )}. Are these ok to use?`,
              name: 'approved',
            },
          ])
          if (!approved) {
            this.logger.error(
              'CG does not have approval to use the credentials it found, please rerun CG with the credentials you want to use'
            )
            throw new Error('Credentials not approved')
          }
        }
      }
      this.logger.success('Found and using the following AWS credentials')
      this.logger.success(
        `profile: ${chalk.underline.green(profile ?? 'default')}`
      )
      this.logger.success(
        `accessKeyId: ${chalk.underline.green(
          obfuscateSensitiveString(credentials.accessKeyId)
        )}`
      )
      this.logger.success(
        `secretAccessKey: ${chalk.underline.green(
          obfuscateSensitiveString(credentials.secretAccessKey)
        )}`
      )
      resolveCreds(credentials)
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
    if (serviceMap[service]) {
      return new serviceMap[service](this)
    }
  }

  /**
   * getData is used to fetch all provider data specified in the config for the provider
   * @param opts: A set of optional values to configure how getData works
   * @returns Promise<any> All provider data
   */
  async getData({ opts }: { opts: Opts }): Promise<ProviderData> {
    const result: ProviderData = {
      entities: [],
      connections: {},
    }
    for (const account of this.config.accounts) {
      let { regions: configuredRegions, resources: configuredResources } = account
      if (!configuredRegions) {
        configuredRegions = this.properties.regions.join(',')
      } else {
        configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
      }
      if (!configuredResources) {
        configuredResources = Object.values(this.properties.services).join(',')
      }
      const credentials = await this.getCredentials(account)
      const rawData = []
      const resourceNames: string[] = [
        ...new Set<string>(configuredResources.split(',')),
      ]

      // Leaving this here in case we need to test another service or to inject a logging function
      // setAwsRetryOptions({ global: true, configObj: this.config })

      // Get Raw data for services
      try {
        for (const resource of resourceNames) {
          const serviceClass = this.getService(resource)
          if (serviceClass && serviceClass.getData) {
            rawData.push({
              name: resource,
              data: await serviceClass.getData({
                regions: configuredRegions,
                credentials,
                opts,
                rawData,
              }),
            })
            this.logger.success(`${resource} scan completed`)
          } else {
            this.logger.warn(`Skipping service ${resource} as there was an issue getting data for it. Is it currently supported?`)
          }
        }
      } catch (error: any) {
        this.logger.error('There was an error scanning AWS sdk data')
        this.logger.debug(error)
      }
      // Handle global tag entities
      try {
        const tagRegion = 'aws-global'
        const tags = { name: 'tag', data: { [tagRegion]: [] } }
        for (const { data: entityData } of rawData) {
          for (const region of Object.keys(entityData)) {
            const dataAtRegion = entityData[region]
            dataAtRegion.forEach(singleEntity => {
              if (!isEmpty(singleEntity.Tags)) {
                for (const [key, value] of Object.entries(singleEntity.Tags)) {
                  if (
                    !tags.data[tagRegion].find(
                      ({ id }) => id === `${key}:${value}`
                    )
                  ) {
                    tags.data[tagRegion].push({
                      id: `${key}:${value}`,
                      key,
                      value,
                    })
                  }
                }
              }
            })
          }
        }
        rawData.push(tags)
      } catch (error: any) {
        this.logger.error('There was an error aggregating AWS tags')
        this.logger.debug(error)
      }

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
      try {
        const { accountId } = await this.getIdentity(account)
        for (const serviceData of rawData) {
          const serviceClass = this.getService(serviceData.name)
          const entities: any[] = []
          for (const region of Object.keys(serviceData.data)) {
            const data = serviceData.data[region]
            if (!isEmpty(data)) {
              data.forEach((service: any) => {
                entities.push(
                  serviceClass.format({
                    service,
                    region,
                    account: accountId,
                  })
                )
                if (typeof serviceClass.getConnections === 'function') {
                  // We need to loop through all configured regions here because services can be connected to things in another region
                  for (const connectionRegion of configuredRegions.split(',')) {
                    result.connections = {
                      ...result.connections,
                      ...serviceClass.getConnections({
                        service,
                        region: connectionRegion,
                        account: accountId,
                        data: rawData,
                      }),
                    }
                  }
                }
              })
            }
          }
          result.entities.push({
            name: serviceData.name,
            mutation: serviceClass.mutation,
            data: entities,
          })
        }
      } catch (error: any) {
        this.logger.error('There was an error building connections for AWS data')
        this.logger.debug(error)
      }
      try {
        result.entities = this.enrichInstanceWithBillingData(configuredRegions, rawData, result.entities)
      } catch (error: any) {
        this.logger.error('There was an error enriching AWS data with billing data')
        this.logger.debug(error)
      }
    }
    return result
  }

  enrichInstanceWithBillingData(
    configuredRegions: string,
    rawData: any,
    entities: any
  ): any[] {
    const billingRegion = regionMap.usEast1
    let result = entities
    if (configuredRegions.includes(billingRegion)) {
      const billing =
        rawData.find(({ name }) => name === services.billing) ?? {}
      const individualData: {
        [key: string]: { cost: number; currency: string; formattedCost: string }
      } = get(
        billing,
        ['data', billingRegion, '0', 'individualData'],
        undefined
      )
      if (individualData) {
        for (const [key, value] of Object.entries(individualData)) {
          if (key.includes('natgateway') && !isEmpty()) {
            // this billing data is for natgateway, search for the instance
            const {
              name,
              mutation,
              data: nats,
            } = result.find(
              ({ name: instanceName }: { name: string }) =>
                instanceName === services.nat
            ) ?? {}
            if (!isEmpty(nats)) {
              const natsWithBilling = nats.map(val => {
                if (key.includes(val.id)) {
                  return {
                    ...val,
                    dailyCost: {
                      cost: value?.cost,
                      currency: value?.currency,
                      formattedCost: value?.formattedCost
                    },
                  }
                }
                return val
              })
              result = result.filter(
                ({ name: serviceName }) => serviceName !== services.nat
              )
              result.push({
                name,
                mutation,
                data: natsWithBilling,
              })
            }
          }
          if (key.includes('i-')) {
            // this billing data is for ec2, search for the instance
            const {
              name,
              mutation,
              data: ec2s,
            } = result.find(
              ({ name: instanceName }: { name: string }) =>
                instanceName === services.ec2Instance
            ) ?? {}
            if (!isEmpty(ec2s)) {
              const ec2WithBilling = ec2s.map(val => {
                if (key === val.id) {
                  return {
                    ...val,
                    dailyCost: value,
                  }
                }
                return val
              })
              result = result.filter(
                ({ name: serviceName }) => serviceName !== services.ec2Instance
              )
              result.push({
                name,
                mutation,
                data: ec2WithBilling,
              })
            }
          }
        }
      }
    }
    return result
  }
}
