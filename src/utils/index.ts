import AWS, { ConfigurationOptions } from 'aws-sdk'
import { APIVersions } from 'aws-sdk/lib/config'
import CloudGraph, { Opts } from '@cloudgraph/sdk'
import STS from 'aws-sdk/clients/sts'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import unionWith from 'lodash/unionWith'

import environment from '../config/environment'
import { Credentials } from '../types'
import {
  BASE_CUSTOM_RETRY_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../config/constants'

const { logger } = CloudGraph

export async function getAccountId({
  credentials,
}: // opts,
{
  credentials: Credentials
  opts?: Opts
}): Promise<any> {
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

export function getCredentials(opts: Opts): Promise<Credentials> {
  return new Promise(resolve => {
    AWS.config.getCredentials((err: any) => {
      if (err) {
        opts.logger.log(err)
        throw new Error(
          'Unable to find Credentials for AWS, They could be stored in env variables or .aws/credentials file'
        )
      } else {
        resolve(AWS.config.credentials)
      }
    })
  })
}

/* Method to inject to set aws global config settings,
   logger utility or to use a particular aws config profile */
export const setAwsRetryOptions = (opts: {
  baseDelay?: number
  global?: boolean
  maxRetries?: number
  configObj?: any
  profile?: string
}): void | (ConfigurationOptions & APIVersions) => {
  const {
    global = false,
    maxRetries = MAX_FAILED_AWS_REQUEST_RETRIES,
    baseDelay: base = BASE_CUSTOM_RETRY_DELAY,
    profile = undefined,
    configObj = undefined,
    ...rest
  } = opts
  // logger.log = logger.debug
  const config: ConfigurationOptions & APIVersions = {
    maxRetries,
    // logger,
    retryDelayOptions: {
      base,
    },
    ...rest,
  }
  if (profile && configObj) {
    configObj.profile = profile
  }
  global && AWS.config.update(config)
  return config
}

export function initTestEndpoint(service?: string): string | undefined {
  const endpoint =
    (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
    undefined
  service && endpoint && logger.info(`${service} getData in test mode!`)
  return endpoint
}

export function initTestConfig(): void {
  jest.setTimeout(900000)
}

export const settleAllPromises = async (
  promises: Promise<any>[]
): Promise<any[]> =>
  (await Promise.allSettled(promises)).map(
    /** We force the PromiseFulfilledResult interface
     *  because all promises that we input to Promise.allSettled
     *  are always resolved, that way we suppress the compiler error complaining
     *  that Promise.allSettled returns an Array<PromiseFulfilledResult | PromiseRejectedResult>
     *  and that the value property doesn't exist for the PromiseRejectedResult interface */
    i => (i as PromiseFulfilledResult<any>).value
  )

export const checkAndMergeConnections = (
  serviceConnections: any,
  connectionsToMerge: any
): any => {
  let connections = serviceConnections
  // IF we have no pre existing connections for this service, use new connections
  // IF we have pre existing connections, check if its for the same serivce id, if so
  // check if the connections list for that id is empty, use new connections for that id if so.
  // otherwise, merge connections by unioning on id of the connections
  if (!isEmpty(connections)) {
    const entries: [string, any][] = Object.entries(connectionsToMerge)
    for (const [key] of entries) {
      // If there are no service connections for this entity i.e. { [serviceId]: [] }
      // use new connections for that key
      if (connections[key]) {
        if (isEmpty(connections[key])) {
          connections[key] = connectionsToMerge[key] ?? []
        } else {
          connections[key] = unionWith(
            connections[key],
            connectionsToMerge[key] ?? [],
            isEqual
          )
        }
      } else {
        Object.assign(connections, connectionsToMerge)
      }
    }
    return connections
  }
  return connectionsToMerge
}

export const caseInsensitiveIncludes = (arr: string[], s1: string): boolean =>
  !isEmpty(arr) &&
  arr.filter(str => str.toLowerCase().includes(s1.toLowerCase())).length > 0
