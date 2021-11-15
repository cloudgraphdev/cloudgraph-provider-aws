import { parseString } from '@fast-csv/parse'
import CloudGraph from '@cloudgraph/sdk'

import { Tag } from '../types/generated'
import { AwsTag, TagMap } from '../types'

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

export const formatTagsFromMap = (tags: TagMap): Tag[] => {
  const result: Tag[] = []
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
