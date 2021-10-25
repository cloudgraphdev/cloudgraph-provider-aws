// import AWS, { AWSError, ConfigurationOptions } from 'aws-sdk'
// import { APIVersions } from 'aws-sdk/lib/config'
import CloudGraph from '@cloudgraph/sdk'
import camelCase from 'lodash/camelCase'
import environment from '../config/environment'
import {
  BASE_CUSTOM_RETRY_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../config/constants'
import relations from '../enums/relations'

const { logger } = CloudGraph

export const toCamel = (o: any): any => {
  let origKey
  let newKey
  let value

  if (o instanceof Array) {
    return o.map(value => {
      if (typeof value === 'object') {
        value = toCamel(value)
      }
      return value
    })
  }

  const newObject = {}
  for (origKey in o) {
    if (o.hasOwnProperty(origKey)) {
      newKey = camelCase(origKey)
      value = o[origKey]
      if (
        value instanceof Array ||
        (value !== null && value !== undefined && value.constructor === Object)
      ) {
        value = toCamel(value)
      }
      newObject[newKey] = value
    }
  }

  return newObject
}

export const getKeyByValue = (
  object: Record<string, unknown>,
  value: any
): string | undefined => {
  return Object.keys(object).find(key => object[key] === value)
}

export const intersectStringArrays = (
  a: Array<string>,
  b: Array<string>
): Array<string> => {
  const setA = new Set(a)
  const setB = new Set(b)
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  return Array.from(intersection)
}

// export async function getAccountId({
//   credentials,
// }: // opts,
// {
//   credentials: Credentials
//   opts?: Opts
// }): Promise<any> {
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

// export function getCredentials(opts: Opts): Promise<Credentials> {
//   return new Promise(resolve => {
//     AWS.config.getCredentials((err: any) => {
//       if (err) {
//         opts.logger.log(err)
//         throw new Error(
//           'Unable to find Credentials for AWS, They could be stored in env variables or .aws/credentials file'
//         )
//       } else {
//         resolve(AWS.config.credentials)
//       }
//     })
//   })
// }

/* Method to inject to set aws global config settings,
   logger utility or to use a particular aws config profile */
export const setAwsRetryOptions = (opts: {
  baseDelay?: number
  global?: boolean
  maxRetries?: number
  configObj?: any
  profile?: string
}): void | any => {
  const {
    global = false,
    maxRetries = MAX_FAILED_AWS_REQUEST_RETRIES,
    baseDelay: base = BASE_CUSTOM_RETRY_DELAY,
    profile = undefined,
    configObj = undefined,
    ...rest
  } = opts
  // logger.log = logger.debug
  const config: any = {
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

export function generateAwsErrorLog(
  service: string,
  functionName: string,
  err?: any
): void {
  if (err.statusCode === 400) {
    err.retryable = true
  }
  const notAuthorized = 'not authorized' // part of the error string aws passes back for permissions errors
  const accessDenied = 'AccessDeniedException' // an error code aws sometimes sends back for permissions errors
  const throttling = 'Throttling'

  if (err?.code !== throttling) {
    logger.warn(
      `There was a problem getting data for service ${service}, CG encountered an error calling ${functionName}`
    )
  }
  if (err?.message?.includes(notAuthorized) || err?.code === accessDenied) {
    logger.warn(err.message)
  }
  logger.debug(err)
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

/**
 * Sorts a services list depending on his dependencies
 * @param resourceNames services to sort
 * @returns sorted list of services
 */
export const sortResourcesDependencies = (resourceNames: string[]): string[] =>
  resourceNames.sort((prevResource, nextResource) => {
    const dependecies = relations[prevResource]

    if (dependecies && dependecies.includes(nextResource)) {
      return -1
    }
    return 0
  })
