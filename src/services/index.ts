import CloudGraph, {
  Service,
  Opts,
  ProviderData,
  sortResourcesDependencies,
} from '@cloudgraph/sdk'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import AWS, { Config } from 'aws-sdk'
import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader'
import { fromIni } from '@aws-sdk/credential-providers'
import chalk from 'chalk'
import { DocumentNode } from 'graphql'
import STS from 'aws-sdk/clients/sts'
import { isEmpty, merge } from 'lodash'
import path from 'path'

import regions from '../enums/regions'
import resources from '../enums/resources'
import services from '../enums/services'
import serviceMap from '../enums/serviceMap'
import schemasMap from '../enums/schemasMap'
import relations from '../enums/relations'
import { Credentials } from '../types'
import { obfuscateSensitiveString } from '../utils/format'
import { checkAndMergeConnections } from '../utils'
import { Account, rawDataInterface } from './base'
import enhancers, { EnhancerConfig } from './base/enhancers'

const DEFAULT_REGION = 'us-east-1'
const DEFAULT_RESOURCES = Object.values(services).join(',')
const ENV_VAR_CREDS_LOG = 'Using ENV variable credentials'

export const enums = {
  services,
  regions,
  resources,
  schemasMap,
}

export default class Provider extends CloudGraph.Client {
  constructor(config: any) {
    super(config)
    this.properties = enums
  }

  private credentials: Credentials | undefined

  private profile: string | undefined

  private role: string | undefined

  private properties: {
    services: { [key: string]: string }
    regions: string[]
    resources: { [key: string]: string }
  }

  logSelectedAccessRegionsAndResources(
    profilesOrRolesToLog: string[],
    regionsToLog: string,
    resourcesToLog: string
  ): void {
    this.logger.info(
      `Profiles and role ARNs configured: ${chalk.green(
        profilesOrRolesToLog.join(', ')
      )}`
    )
    this.logger.info(
      `Regions configured: ${chalk.green(regionsToLog.replace(/,/g, ', '))}`
    )
    this.logger.info(
      `Resources configured: ${chalk.green(resourcesToLog.replace(/,/g, ', '))}`
    )
  }

  // TODO: update to also support ignorePrompts config
  async configure(): Promise<{ [key: string]: any }> {
    const { flags = {}, cloudGraphConfig, ...providerSettings } = this.config
    const result: { [key: string]: any } = { ...providerSettings }
    let profiles
    try {
      profiles = await this.getProfilesFromSharedConfig()
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
      } else {
        this.logger.info(
          '** NOTE: if you want to use the "built in" (metadata) credentials for ec2/ecs, leave the roleArn blank for that account.'
        )
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

  private unsetAwsCredentials(): void {
    this.credentials = undefined
  }

  private getAwsConfig({
    profile,
    roleArn: role,
    externalId,
    accessKeyId: configuredAccessKey,
    secretAccessKey: configuredSecretKey,
  }: Account): Promise<Config> {
    const {
      cloudGraphConfig: { ignorePrompts, ignoreEnvVariables } = {
        ignorePrompts: false,
        ignoreEnvVariables: false,
      },
    } = this.config
    let configCopy
    return new Promise(async (resolveConfig, rejectConfig) => {
      // If we have keys set in the config file, just use them
      if (configuredAccessKey && configuredSecretKey) {
        const creds = {
          accessKeyId: configuredAccessKey,
          secretAccessKey: configuredSecretKey,
        }
        if (!this.credentials) {
          this.logger.warn(
            'Using hard coded accessKeyId and secretAccessKey, it is not advised to save these in config'
          )
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
        this.credentials = creds
        configCopy = { ...AWS.config, credentials: this.credentials }
        return resolveConfig(configCopy)
      }
      // If the client instance has creds set, weve gone through this function before.. just reuse them
      if (
        this.credentials &&
        (this.profile === profile || this.role === role)
      ) {
        configCopy = { ...AWS.config, credentials: this.credentials }
        return resolveConfig(configCopy)
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
          let sts = new AWS.STS()
          await new Promise<void>(async resolve => {
            if (profile && profile !== 'default') {
              let creds: AWS.Credentials
              const credsFunction = fromIni({
                profile,
                // MFA token support
                mfaCodeProvider: async () => {
                  this.logger.debug('MFA token needed, requesting...')
                  const { mfaToken = '' }: { mfaToken: string } = await this.interface.prompt([
                    {
                      type: 'input',
                      message: `Please enter the MFA token for ${profile}`,
                      name: 'mfaToken'
                    },
                  ])
                  return mfaToken
                }
              })
              if (creds) {
                sts = new AWS.STS({ credentials: await credsFunction() })
              }
            }
            const options = {
              RoleSessionName: 'CloudGraph',
              RoleArn: role,
              ...(externalId && { ExternalId: externalId }),
            }
            sts.assumeRole(options, (err, data) => {
              if (err) {
                this.logger.error(
                  `No valid credentials found for roleARN: ${role}`
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
                this.credentials = creds
                configCopy = { ...AWS.config, credentials: creds }
                this.profile = profile
                resolve()
              }
            })
          })
          break
        }
        case profile && profile !== 'default': {
          try {
            const credentials = this.getSharedIniFileCredentials(profile)
            if (credentials) {
              this.credentials = credentials
              configCopy = { ...AWS.config, credentials }
              this.profile = profile
            }
            break
          } catch (error: any) {
            break
          }
        }
        default: {
          // unset credentials before getting them for multi account scenarios
          this.unsetAwsCredentials()
          await new Promise<void>(resolve =>
            AWS.config.getCredentials((err: any) => {
              if (err) {
                resolve()
              } else {
                this.credentials = AWS.config.credentials
                configCopy = { ...AWS.config, credentials: this.credentials }
                this.profile = profile
                resolve()
              }
            })
          )
        }
      }
      if (!this.credentials && !ignorePrompts) {
        this.logger.info(
          'No AWS Credentials found for scan, please enter them manually'
        )
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
          configCopy = { ...AWS.config, credentials: this.credentials }
        } else {
          const errText = 'Cannot scan AWS without credentials'
          this.logger.error(errText)
          return rejectConfig(new Error(errText))
        }
        this.logger.startSpinner(msg)
      }
      const profileName = profile || 'default'
      const usingEnvCreds =
        !!process.env.AWS_ACCESS_KEY_ID && !ignoreEnvVariables
      if (!this.credentials) {
        return rejectConfig(new Error('No Credentials found for AWS'))
      }
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
      resolveConfig(configCopy)
    })
  }

  /**
   * getSchema is used to get the schema for provider
   * @returns A string of graphql sub schemas
   */
   getSchema(): DocumentNode {
    const typesArray = loadFilesSync(path.join(__dirname), {
      recursive: true,
      extensions: ['graphql'],
    })
    return mergeTypeDefs(typesArray)
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

  private getSharedIniFileCredentials(
    profile: string
  ): AWS.SharedIniFileCredentials {
    let credentials
    try {
      // TODO: how to catch the error from SharedIniFileCredentials when profile doent exist
      credentials = new AWS.SharedIniFileCredentials({
        profile,
        callback: (err: any) => {
          if (err) {
            this.logger.error(`No credentials found for profile ${profile}`)
          }
        },
      })
    } catch (error: any) {
      this.logger.debug(error)
    }

    return credentials
  }

  private async getProfilesFromSharedConfig(): Promise<string[]> {
    let profiles = []
    try {
      const filesObject = await loadSharedConfigFiles()
      const files = Object.keys(filesObject)
      for (const file of files) {
        const fileProfiles = Object.keys(filesObject[file])
        if (fileProfiles && fileProfiles.length > 0) {
          profiles.push(...fileProfiles)
        }
      }
    } catch (error: any) {
      this.logger.warn('Unable to read AWS shared credential file')
      this.logger.debug(error)
    }
    return profiles
  }

  private mergeRawData(
    oldData: rawDataInterface[],
    newData: rawDataInterface[]
  ): rawDataInterface[] {
    if (isEmpty(oldData)) {
      return newData
    }
    const result: rawDataInterface[] = []
    for (const entity of oldData) {
      try {
        const { className, name, data } = entity
        const newDataForEntity =
          newData.find(({ name: serviceName }) => name === serviceName).data ||
          {}
        if (newDataForEntity) {
          let mergedData = {}
          // if there is no old data for this service but there is new data, use the new data
          if (isEmpty(data)) {
            mergedData = newDataForEntity
          } else {
            // if we have data for an entity (like vpc) in both data sets, merge their data
            for (const region in data) {
              if (newDataForEntity[region]) {
                this.logger.debug(
                  `Found additional data for ${name} in ${region}, merging`
                )
                mergedData[region] = [
                  ...(data[region] ?? []),
                  ...newDataForEntity[region],
                ]
              } else {
                mergedData[region] = data[region]
              }
            }
          }
          result.push({
            className,
            name,
            data: mergedData,
          })
          // if not, just use the old data
        } else {
          result.push({
            className,
            name,
            data,
          })
        }
      } catch (error: any) {
        this.logger.debug(error)
        this.logger.error('There was an error merging raw data for AWS')
      }
    }
    return result
  }

  private async getRawData(
    account: Account,
    opts?: Opts
  ): Promise<rawDataInterface[]> {
    let { regions: configuredRegions, resources: configuredResources } =
      this.config
    const result: rawDataInterface[] = []
    if (!configuredRegions) {
      configuredRegions = this.properties.regions.join(',')
    } else {
      configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
    }
    if (!configuredResources) {
      configuredResources = Object.values(this.properties.services).join(',')
    }
    const resourceNames: string[] = sortResourcesDependencies(relations, [
      ...new Set<string>(configuredResources.split(',')),
    ])

    const config = await this.getAwsConfig(account)
    const { accountId } = await this.getIdentity(account)
    for (const resource of resourceNames) {
      const serviceClass = this.getService(resource)
      if (serviceClass && serviceClass.getData) {
        try {
          const data = await serviceClass.getData({
            regions: configuredRegions,
            config,
            opts,
            account: accountId,
            rawData: result,
          })
          result.push({
            className: serviceClass.constructor.name,
            name: resource,
            accountId,
            data,
          })
          this.logger.success(`${resource} scan completed`)
        } catch (error: any) {
          this.logger.error(
            `There was an error scanning AWS sdk data for ${resource} resource`
          )
          this.logger.debug(error)
        }
      } else {
        this.logger.warn(
          `Skipping service ${resource} as there was an issue getting data for it. Is it currently supported?`
        )
      }
    }
    this.logger.success(`Account: ${accountId} scan completed`)
    return result
  }

  private enhanceData({ data, ...config }: EnhancerConfig): ProviderData {
    let enhanceData = {
      entities: data.entities,
      connections: data.connections,
    }
    for (const { name, enhancer } of enhancers) {
      try {
        enhanceData = enhancer({ ...config, data: enhanceData })
      } catch (error: any) {
        this.logger.error(
          `There was an error enriching AWS data with ${name} data`
        )
        this.logger.debug(error)
        return enhanceData
      }
    }

    return enhanceData
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
    const {
      accounts: configuredAccounts,
      cloudGraphConfig: { ignoreEnvVariables } = { ignoreEnvVariables: false },
    }: {
      accounts: Account[]
      cloudGraphConfig: { ignoreEnvVariables: boolean }
    } = this.config
    if (!configuredRegions) {
      configuredRegions = this.properties.regions.join(',')
    } else {
      configuredRegions = [...new Set(configuredRegions.split(','))].join(',')
    }
    if (!configuredResources) {
      configuredResources = Object.values(this.properties.services).join(',')
    }

    const usingEnvCreds = !!process.env.AWS_ACCESS_KEY_ID && !ignoreEnvVariables

    this.logSelectedAccessRegionsAndResources(
      usingEnvCreds
        ? [ENV_VAR_CREDS_LOG]
        : configuredAccounts.map(acct => {
            return acct.roleArn || acct.profile
          }),
      configuredRegions,
      configuredResources
    )

    // Leaving this here in case we need to test another service or to inject a logging function
    // setAwsRetryOptions({ global: true, configObj: this.config })
    let rawData: rawDataInterface[] = []
    // We need to keep a merged copy of raw data so we can handle connections but keep a separate raw
    // data so we can pass along accountId
    // TODO: find a better way to handle this
    let mergedRawData: rawDataInterface[] = []
    const globalRegion = 'aws-global'
    const tags = { className: 'Tag', name: 'tag', data: { [globalRegion]: [] } }
    const accounts = {
      className: 'AwsAccount',
      name: 'account',
      data: { [globalRegion]: [] },
    }
    // If the user has passed aws creds as env variables, dont use profile list
    if (usingEnvCreds) {
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
          const profiles = await this.getProfilesFromSharedConfig()
          if (!profiles.includes(profile)) {
            this.logger.warn(
              `Profile: ${profile} not found in shared credentials file. Skipping...`
            )
            // eslint-disable-next-line no-continue
            continue
          }
        }
        const { accountId } = await this.getIdentity(account)
        accounts.data[globalRegion].push({
          id: accountId,
          regions: configuredRegions.split(','),
        })
        if (!crawledAccounts.find(val => val === accountId)) {
          crawledAccounts.push(accountId)
          const newRawData = await this.getRawData(account, opts)
          mergedRawData = this.mergeRawData(mergedRawData, newRawData)
          rawData = [...rawData, ...newRawData]
        } else {
          this.logger.warn(
            // eslint-disable-next-line max-len
            `${profile ? 'profile' : 'roleARN'}: ${
              profile ?? role
            } returned accountId ${accountId} which has already been crawled, skipping...`
          )
        }
        this.unsetAwsCredentials()
      }
    }
    // Handle global tag entities
    try {
      for (const { data: entityData } of rawData) {
        for (const region of Object.keys(entityData)) {
          const dataAtRegion = entityData[region] ?? []
          dataAtRegion.forEach(singleEntity => {
            if (!isEmpty(singleEntity.Tags)) {
              for (const [key, value] of Object.entries(singleEntity.Tags)) {
                if (
                  !tags.data[globalRegion].find(
                    ({ id }) => id === `${key}:${value}`
                  )
                ) {
                  tags.data[globalRegion].push({
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
      rawData.push(accounts)
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

    for (const serviceData of rawData) {
      try {
        const serviceClass = this.getService(serviceData.name)
        const entities: any[] = []
        for (const region of Object.keys(serviceData.data)) {
          await new Promise(resolve => setTimeout(resolve, 10)) // free the main nodejs thread to process other requests
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
                  const connections = serviceClass.getConnections({
                    service,
                    region: connectionRegion,
                    account: serviceData.accountId,
                    data: mergedRawData,
                  })
                  serviceConnections = checkAndMergeConnections(
                    serviceConnections,
                    connections
                  )
                }
                Object.assign(result.connections, serviceConnections)
              }
            })
          }
        }
        /**
         * we have 2 things to check here, both dealing with multi-account senarios
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
            const exisingEntityIdx = existingData.findIndex(
              ({ id }) => id === currentEntity.id
            )
            if (exisingEntityIdx > -1) {
              const entityToDelete = existingData[exisingEntityIdx]
              existingData.splice(exisingEntityIdx, 1)
              const entityToMergeIdx = entities.findIndex(
                ({ id }) => id === currentEntity.id
              )
              entities[entityToMergeIdx] = merge(entityToDelete, currentEntity)
            }
          }
          result.entities[existingServiceIdx] = {
            className: serviceClass.constructor.name,
            name: serviceData.name,
            mutation: serviceClass.mutation,
            data: [...existingData, ...entities],
          }
        } else {
          result.entities.push({
            className: serviceClass.constructor.name,
            name: serviceData.name,
            mutation: serviceClass.mutation,
            data: entities,
          })
        }
      } catch (error: any) {
        this.logger.error(
          `There was an error formatting/connecting service ${serviceData.name} `
        )
        this.logger.debug(error)
      }
    }

    return this.enhanceData({
      accounts: accounts.data[globalRegion],
      configuredRegions,
      rawData: mergedRawData,
      data: result,
    })
  }
}
