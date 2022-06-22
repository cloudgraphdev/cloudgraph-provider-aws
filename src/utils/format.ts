import { parseString } from '@fast-csv/parse'
import CloudGraph, { generateUniqueId } from '@cloudgraph/sdk'
import isArray from 'lodash/isArray'
import toString from 'lodash/toString'
import {
  AwsRawTag,
  AwsIamJsonPolicy,
  AwsIamJsonPolicyCondition,
  AwsIamJsonPolicyPrincipal,
  AwsIamJsonPolicyStatement,
  AwsTag,
  RawAwsIamJsonPolicy,
  RawAwsIamJsonPolicyStatement,
  RawAwsIamJsonPolicyStatementCondition,
  RawAwsIamJsonPolicyStatementPrincipal,
  TagMap,
} from '../types'

const { logger } = CloudGraph

/**
 * Function to convert aws formatted tags to TagMap
 */
export const convertAwsTagsToTagMap = (tags: AwsTag[] = []): TagMap => {
  const tagsMap = {}
  for (const tag of tags) {
    const { Key, Value } = tag
    tagsMap[Key] = Value
  }
  return tagsMap
}

export const formatTagsFromMap = (tags: TagMap): AwsRawTag[] => {
  const result: AwsRawTag[] = []
  for (const [key, value] of Object.entries(tags)) {
    // We need an id here to enfore uniqueness for Dgraph, otherwise we get duplicate tags
    result.push({ id: `${key}:${value}`, key, value })
  }
  return result
}

export const obfuscateSensitiveString = (s: string): string => {
  const stars = '*'.repeat(Math.min(30, s.length - 6))
  return s.slice(0, 3) + stars + s.slice(stars.length + 3, s.length)
}

/**
 * Transform key from snake_case to camelCase
 */
export const camelize = (key: string): string =>
  key.replace(/[\-_\s]+(.)?/g, (_, character) => {
    return character ? character.toUpperCase() : ''
  })

/**
 * Transform key from snake_case to PascalCase
 */
export const pascalize = (key: string): string => {
  const camelized = camelize(key)
  // TODO: Change to String.slice?
  return camelized.substr(0, 1).toUpperCase() + camelized.substr(1)
}

export const parseCSV = (csv: string): Promise<any[]> =>
  new Promise(resolve => {
    const credentialReportData = []

    parseString(csv, {
      headers: headers => headers.map(h => pascalize(h)),
    })
      .on('error', () => resolve([]))
      .on('data', row => credentialReportData.push(row))
      .on('end', (rowCount: number) => {
        logger.debug(`Parsed ${rowCount} rows`)
        resolve(credentialReportData)
      })
  })

export const formatIamJsonPolicy = (json: string): AwsIamJsonPolicy => {
  let object: RawAwsIamJsonPolicy
  try {
    object = JSON.parse(json.replace(/\\"/g, '"'))
  } catch (err) {
    return null
  }

  const statement = isArray(object.Statement)
    ? object.Statement
    : [object.Statement]
  const formatCondition = (
    condition: RawAwsIamJsonPolicyStatementCondition
  ): AwsIamJsonPolicyCondition[] => {
    if (!condition) return null
    return Object.entries(condition).map(([key, value = {}]) => {
      const entry = Object.entries(value)[0] || []
      const conVal = (isArray(entry[1]) ? entry[1] : [entry[1]]) || []
      return {
        operator: key,
        key: entry[0],
        value: conVal.map(val => toString(val)),
      }
    })
  }

  const formatPrincipal = (
    principal: RawAwsIamJsonPolicyStatementPrincipal
  ): AwsIamJsonPolicyPrincipal[] => {
    if (!principal) return null
    return Object.entries(principal).map(([key, value]) => {
      const conVal = (isArray(value) ? value : [value]) || []
      return {
        key: key === '0' ? '' : key.toString(),
        value: conVal.map(val => toString(val)),
      }
    })
  }

  return {
    id: generateUniqueId(json),
    version: object.Version,
    statement: statement.map(
      (el: RawAwsIamJsonPolicyStatement): AwsIamJsonPolicyStatement => ({
        action: isArray(el.Action) ? el.Action : [toString(el.Action)],
        notAction: isArray(el.NotAction)
          ? el.NotAction
          : [toString(el.NotAction)],
        condition: formatCondition(el.Condition),
        effect: el.Effect,
        principal: formatPrincipal(el.Principal),
        notPrincipal: formatPrincipal(el.NotPrincipal),
        resource: isArray(el.Resource) ? el.Resource : [toString(el.Resource)],
        notResource: isArray(el.NotResource)
          ? el.NotResource
          : [toString(el.NotResource)],
      })
    ),
  }
}
