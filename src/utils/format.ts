import { Tag } from '../types/generated'
import { AwsTag, TagMap } from '../types'

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
