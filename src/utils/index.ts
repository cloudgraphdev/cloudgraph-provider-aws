import AWS from 'aws-sdk'
import CloudGraph, { Opts } from '@cloudgraph/sdk'
import STS from 'aws-sdk/clients/sts'
import camelCase from 'lodash/camelCase'
import environment from '../config/environment'
import { Credentials } from '../types'

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
        (value !== null && value.constructor === Object)
      ) {
        value = toCamel(value)
      }
      newObject[newKey] = value
    }
  }

  return newObject
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

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

export function initTestEndpoint(service?: string): string | undefined {
  const endpoint =
  (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
  service && endpoint && logger.info(`${service} getData in test mode!`)
  return endpoint
}

export function initTestConfig(): void {
  jest.setTimeout(30000)
}