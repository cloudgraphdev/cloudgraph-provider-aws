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
  const result = []
  for (const [key, value] of Object.entries(tags)) {
    result.push({ key, value })
  }
  return result
}
