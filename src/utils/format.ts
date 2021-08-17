import { Tag } from '../types/generated'
import {AwsTag, TagMap} from '../types'

/**
 * Convert Aws Tags into tags array
 * @param awsTags
 * @returns
 */
export const formatTags = (awsTags: { Key: string; Value: string }[]): Tag[] =>
  awsTags.map(tag => ({ key: tag.Key, value: tag.Value }))

/**
 * Function to convert aws formatted tags to TagMap
 */
 export const convertAwsTagsToTagMap = (tags: AwsTag[] = []): TagMap => {
   console.log(JSON.stringify(tags))
  const tagsMap = {}
  for (const tag of tags) {
    const {Key, Value} = tag
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

export default {
  tags: formatTags,
}
