import CloudGraph, { Service, Opts, ProviderData } from '@cloudgraph/sdk'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import AWS, { Config } from 'aws-sdk'
import chalk from 'chalk'
import { print } from 'graphql'
import STS from 'aws-sdk/clients/sts'
import { isEmpty, get, merge, unionBy } from 'lodash'
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
const ENV_VAR_CREDS_LOG = 'Using ENV variable credentials'

export const enums = {
  services,
  regions,
  resources,
}

interface Account {
  profile: string
  roleArn: string | undefined
  externalId: string | undefined
  accessKeyId?: string
  secretAccessKey?: string
}
export default class Provider extends CloudGraph.Client {
  constructor(config: any) {
    super(config)
    this.properties = enums
    this.serviceMap = serviceMap
  }

  private credentials: Credentials | undefined

  private profile: string | undefined

  private role: string | undefined

  private serviceMap: { [key: string]: any } // TODO: how to type the service map

  private properties: {
    services: { [key: string]: string }
    regions: string[]
    resources: { [key: string]: string }
  }

  logSelectedAccessRegionsAndResources(
    accessType: string,
    profilesOrRolesToLog: string[],
    regionsToLog: string,
    resourcesToLog: string
  ): void {
    this.logger.info(
      `${
        accessType === 'profile' ? 'profiles' : 'roleARNs'
      } configured: ${chalk.green(profilesOrRolesToLog.join(', '))}`
    )
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
    let profiles
    try {
      profiles = this.getProfilesFromSharedConfig()
    } catch (error: any) {
      this.logger.warn('No AWS profiles found')
    }
    const accounts = []
    /**
     * Multi account setup flow. We loop through the questions and allow them to answer yes to add another account
     * If we find profiles, we show that list of profiles and allow them to select one
     * They can then add a role ARN and externalId to that profile for it to assume other roles
     * If we find no profiles, they can input just a role ARN and (if needed) an externalId to authenticate that way
     * If they want to just use default creds of the system (such as in ec2), they can just answer no to the role ARN ?
     */
    while (true) {
      if (accounts.length > 0) {
        const { addAccount } = await this.interface.prompt([
          {
            type: 'confirm',
            message: 'Configure another AWS account?',
            name: 'addAccount',
            default: true,
          },
        ])
        if (!addAccount) {
          break
        }
      }
      let profile = ''
      let role = ''
      let externalId = ''
      if (!flags['use-roles'] && profiles && profiles.length) {
        const { profile: profileAnswer } = await this.interface.prompt([
          {
            type: 'list',
            message: 'Please select AWS identity',
            name: 'profile',
            loop: false,
            choices: profiles.map((profile: string) => ({
              name: profile,
            })),
          },
        ])
        profile = profileAnswer
      }
      const { addRoleArn } = await this.interface.prompt([
        {
          type: 'confirm',
          message:
            'Do you want to provide a role ARN for this identity to assume?',
          name: 'addRoleArn',
          default: false,
        },
      ])
      if (addRoleArn) {
        const {
          role: roleAnswer,
          externalId: externalIdAnswer,
        }: { role: string; externalId: string } = await this.interface.prompt([
          {
            type: 'input',
            message: 'Enter role ARN for identity to assume',
            name: 'role',
          },
          {
            type: 'input',
            message: 'Enter ExternalID for role OR press ENTER for none',
            name: 'externalId',
          },
        ])
        role = roleAnswer
        externalId = externalIdAnswer
      }
      accounts.push({ profile, roleArn: role, externalId })
    }

    if (!accounts.length) {
      accounts.push({ profile: '', roleArn: '', externalId: '' })
    }

    result.accounts = accounts

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
    this.logSelectedAccessRegionsAndResources(
      flags['use-roles'] || !profiles.length ? 'role' : 'profile',
      result.accounts.map(acct => acct.roleArn ?? acct.profile),
      result.regions,
      result.resources
    )
    return result
  }

  async getIdentity(account: Account): Promise<{ accountId: string }> {
    try {
      const config = await this.getAwsConfig(account)
      return new Promise((resolve, reject) =>
        new STS(config).getCallerIdentity((err, data) => {
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

  private getAwsConfig({
    profile,
    roleArn: role,
    externalId,
    accessKeyId: configuredAccessKey,
    secretAccessKey: configuredSecretKey,
  }: Account): Promise<Config> {
    return new Promise(async resolveConfig => {
      // If we have keys set in the config file, just use them
      if (configuredAccessKey && configuredSecretKey) {
        const creds = {
          accessKeyId: configuredAccessKey,
          secretAccessKey: configuredSecretKey,
        }
        if (!this.credentials) {
          this.logger.warn('Using hard coded accessKeyId and secretAccessKey, it is not advised to save these in config')
          this.logger.success(
            `accessKeyId: ${chalk.underline.green(
              obfuscateSensitiveString(configuredAccessKey)
            )}`
          )
          this.logger.success(
            `secretAccessKey: ${chalk.underline.green(
              obfuscateSensitiveString(configuredSecretKey)
            )}`
          )
        }
        AWS.config.credentials = creds
        this.credentials = creds
        return resolveConfig(AWS.config)
      }
      // If the client instance has creds set, we've gone through this function before.. just reuse them
      if (
        this.credentials &&
        (this.profile === profile || this.role === role)
      ) {
        return resolveConfig(AWS.config)
      }
      /**
       * Tries to find creds in priority order
       * 1. if they have configured a roleArn and profile assume that role using STS
       * 2. if they have configured a profile, assume that profile from ~/.aws/credentials
       * 3. if they have not configured either of the above, assume profile = default from ~/.aws/credentials
       */
      this.logger.info('Searching for AWS credentials...')
      switch (true) {
        case role && role !== '': {
          const sts = new AWS.STS()
          await new Promise<void>(resolve => {
            const options = {
              RoleSessionName: 'CloudGraph',
              RoleArn: role,
              ...(externalId && { ExternalId: externalId }),
            }
            sts.assumeRole(options, (err, data) => {
              if (err) {
                this.logger.error(`No credentials found for roleARN: ${role}`)
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
                AWS.config.update({ credentials: creds })
                this.credentials = creds
                this.profile = profile
                resolve()
              }
            })
          })
          break
        }
        case profile && profile !== 'default': {
          try {
            // TODO: how to catch the error from SharedIniFileCredentials when profile doent exist
            const credentials = new AWS.SharedIniFileCredentials({
              profile,
              callback: (err: any) => {
                if (err) {
                  this.logger.error(
                    `No credentials found for profile ${profile}`
                  )
                }
              },
            })
            if (credentials) {
              AWS.config.update({ credentials })
              this.credentials = credentials
              this.profile = profile
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
                this.profile = profile
                resolve()
              }
            })
          )
        }
      }
      if (!this.credentials) {
        this.logger.info('No AWS Credentials found, please enter them manually')
        // when pausing the ora spinner the position of this call must come after any logger output
        const msg = this.logger.stopSpinner()
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
          this.profile = profile
        } else {
          this.logger.error('Cannot scan AWS without credentials')
          throw new Error()
        }
        this.logger.startSpinner(msg)
      }
      const profileName = profile || 'default'
      const usingEnvCreds = !!process.env.AWS_ACCESS_KEY_ID
      if (usingEnvCreds) {
        this.logger.success('Using credentials set by ENV variables')
      } else {
        this.logger.success('Found and using the following AWS credentials')
        this.logger.success(
          `${role ? 'roleARN' : 'profile'}: ${chalk.underline.green(
            role || profileName
          )}`
        )
      }
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
      resolveConfig(AWS.config)
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

  private getProfilesFromSharedConfig(): string[] {
    let profiles
    try {
      profiles = Object.keys(
        AWS['util'].getProfilesFromSharedConfig(AWS['util'].iniLoader)
      )
    } catch (error: any) {
      this.logger.warn('Unable to read AWS shared credential file')
      this.logger.debug(error)
    }

    return profiles || []
  }

  private async getRawData(
    account: Account,
    opts?: Opts
  ): Promise<{ name: string; accountId: string; data: any }[]> {
    let { regions: configuredRegions, resources: configuredResources } =
      this.config
    const result = []
    if (!configuredRegions) {
      configuredRegions = this.properties.regions.join(',')
    } else {
      configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
    }
    if (!configuredResources) {
      configuredResources = Object.values(this.properties.services).join(',')
    }
    const resourceNames: string[] = sortResourcesDependencies([
      ...new Set<string>(configuredResources.split(',')),
    ])

    const config = await this.getAwsConfig(account)
    const { accountId } = await this.getIdentity(account)
    try {
      for (const resource of resourceNames) {
        const serviceClass = this.getService(resource)
        if (serviceClass && serviceClass.getData) {
          const data = await serviceClass.getData({
            regions: configuredRegions,
            config,
            opts,
            rawData: result,
          })
          result.push({
            name: resource,
            accountId,
            data,
          })
          this.logger.success(`${resource} scan completed`)
        } else {
          this.logger.warn(
            `Skipping service ${resource} as there was an issue getting data for it. Is it currently supported?`
          )
        }
      }
      this.logger.success(`Account: ${accountId} scan completed`)
    } catch (error: any) {
      this.logger.error('There was an error scanning AWS sdk data')
      this.logger.debug(error)
    }
    return result
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
    let { regions: configuredRegions, resources: configuredResources } =
      this.config
    const { accounts: configuredAccounts }: { accounts: Account[] } =
      this.config
    if (!configuredRegions) {
      configuredRegions = this.properties.regions.join(',')
    } else {
      configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
    }
    if (!configuredResources) {
      configuredResources = Object.values(this.properties.services).join(',')
    }

    const usingEnvCreds = !!process.env.AWS_ACCESS_KEY_ID

    this.logSelectedAccessRegionsAndResources(
      configuredAccounts[0].roleArn ? 'role' : 'profile',
      usingEnvCreds
        ? [ENV_VAR_CREDS_LOG]
        : configuredAccounts.map(acct => {
            return acct.roleArn ?? acct.profile
          }),
      configuredRegions,
      configuredResources
    )

    // Leaving this here in case we need to test another service or to inject a logging function
    // setAwsRetryOptions({ global: true, configObj: this.config })
    let rawData = []
    const tagRegion = 'aws-global'
    const tags = { name: 'tag', data: { [tagRegion]: [] } }
    // If the user has passed aws creds as env variables, dont use profile list
    if (process.env.AWS_ACCESS_KEY_ID) {
      rawData = await this.getRawData(
        { profile: 'default', roleArn: undefined, externalId: undefined },
        opts
      )
    } else {
      const crawledAccounts = []
      for (const account of configuredAccounts) {
        const { profile, roleArn: role } = account
        // verify that profile exists in the shared credential file
        if (profile) {
          const profiles = this.getProfilesFromSharedConfig()
          if (!profiles.includes(profile)) {
            this.logger.warn(
              `Profile: ${profile} not found in shared credentials file. Skipping...`
            )
            // eslint-disable-next-line no-continue
            continue
          }
        }
        const { accountId } = await this.getIdentity(account)
        if (!crawledAccounts.find(val => val === accountId)) {
          crawledAccounts.push(accountId)
          rawData = [...rawData, ...(await this.getRawData(account, opts))]
        } else {
          this.logger.warn(
            // eslint-disable-next-line max-len
            `${profile ? 'profile' : 'roleARN'}: ${
              profile ?? role
            } returned accountId ${accountId} which has already been crawled, skipping...`
          )
        }
      }
    }
    // Handle global tag entities
    try {
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
      const existingTagsIdx = rawData.findIndex(({ name }) => {
        return name === 'tag'
      })
      if (existingTagsIdx > -1) {
        rawData[existingTagsIdx] = tags
      } else {
        rawData.push(tags)
      }
    } catch (error: any) {
      this.logger.error('There was an error aggregating AWS tags')
      this.logger.debug(error)
    }

    /**
     * Loop through the aws sdk data to format entities and build connections
     * 1. Format data with provider service format function
     * 2. build connections for data with provider service connections function
     * 3. spread new connections over result.connections
     * 4. push the array of formatted entities into result.entities
     */
    try {
      for (const serviceData of rawData) {
        const serviceClass = this.getService(serviceData.name)
        const entities: any[] = []
        for (const region of Object.keys(serviceData.data)) {
          const data = serviceData.data[region]
          if (!isEmpty(data)) {
            data.forEach((service: any) => {
              const formattedData = serviceClass.format({
                service,
                region,
                account: serviceData.accountId,
              })
              entities.push(formattedData)
              if (typeof serviceClass.getConnections === 'function') {
                // We need to loop through all configured regions here because services can be connected to things in another region
                let serviceConnections = {}
                for (const connectionRegion of configuredRegions.split(',')) {
                  const newConnections = serviceClass.getConnections({
                    service,
                    region: connectionRegion,
                    account: serviceData.accountId,
                    data: rawData,
                  })
                  if (!isEmpty(serviceConnections)) {
                    const entries: [string, any[]][] =
                      Object.entries(serviceConnections)
                    for (const [key, value] of entries) {
                      serviceConnections[key] = unionBy(
                        value,
                        newConnections,
                        'id'
                      )
                    }
                  } else {
                    serviceConnections = newConnections
                  }
                }
                result.connections = {
                  ...result.connections,
                  ...serviceConnections,
                }
              }
            })
          }
        }
        /**
         * we have 2 things to check here, both dealing with multi-account scenarios
         * 1. Do we already have an entity by this name in the result (i.e. both accounts have vpcs)
         * 2. Do we already have the data for an entity that lives in multiple accounts
         * (i.e. a cloudtrail that appears in a master and sandbox account).
         * If so, we need to merge the data. We use lodash merge to recursively merge arrays as there are
         * cases where acct A gets more data for service obj X than acct B does.
         * (i.e. Acct A cannot access the cloudtrail's tags but acct B can because the cloudtrail's arn points to acct B)
         */
        const existingServiceIdx = result.entities.findIndex(({ name }) => {
          return name === serviceData.name
        })
        if (existingServiceIdx > -1) {
          const existingData = result.entities[existingServiceIdx].data
          for (const currentEntity of entities) {
            const existingEntityIdx = existingData.findIndex(
              ({ id }) => id === currentEntity.id
            )
            if (existingEntityIdx > -1) {
              const entityToDelete = existingData[existingEntityIdx]
              existingData.splice(existingEntityIdx, 1)
              const entityToMergeIdx = entities.findIndex(
                ({ id }) => id === currentEntity.id
              )
              entities[entityToMergeIdx] = merge(entityToDelete, currentEntity)
            }
          }
          result.entities[existingServiceIdx] = {
            name: serviceData.name,
            mutation: serviceClass.mutation,
            data: [...existingData, ...entities],
          }
        } else {
          result.entities.push({
            name: serviceData.name,
            mutation: serviceClass.mutation,
            data: entities,
          })
        }
      }
    } catch (error: any) {
      this.logger.error('There was an error building connections for AWS data')
      this.logger.debug(error)
    }
    try {
      result.entities = this.enrichInstanceWithBillingData(
        configuredRegions,
        rawData,
        result.entities
      )
    } catch (error: any) {
      this.logger.error(
        'There was an error enriching AWS data with billing data'
      )
      this.logger.debug(error)
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
                      formattedCost: value?.formattedCost,
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
