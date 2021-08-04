import { Tag } from '../types/generated'

/**
 * Convert Aws Tags into tags array
 * @param awsTags
 * @returns
 */
export const formatTags = (awsTags: { Key: string; Value: string }[]): Tag[] =>
  awsTags.map(tag => ({ key: tag.Key, value: tag.Value }))

export default {
  tags: formatTags,
}
