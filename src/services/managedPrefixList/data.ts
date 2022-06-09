import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeManagedPrefixListsRequest,
  DescribeManagedPrefixListsResult,
  GetManagedPrefixListEntriesRequest,
  GetManagedPrefixListEntriesResult,
  ManagedPrefixList,
  PrefixListEntry,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { AwsTag, TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Managed Prefix List'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listManagedPrefixListData = async ({
  ec2,
  resolveRegion,
}: {
  ec2: EC2
  resolveRegion: () => void
}): Promise<ManagedPrefixList[]> =>
  new Promise<ManagedPrefixList[]>(resolve => {
    const managedPrefixLists: ManagedPrefixList[] = []
    let args: DescribeManagedPrefixListsRequest = {}

    const listManagedPrefixLists = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.describeManagedPrefixLists(
          args,
          (err: AWSError, data: DescribeManagedPrefixListsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeManagedPrefixLists',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const { NextToken: nextToken, PrefixLists: prefixLists = [] } = data

            if (isEmpty(prefixLists)) {
              return resolveRegion()
            }

            managedPrefixLists.push(...prefixLists)

            logger.debug(lt.fetchedManagedPrefixLists(prefixLists.length))

            if (nextToken) {
              listManagedPrefixLists(nextToken)
            } else {
              resolve(managedPrefixLists)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listManagedPrefixLists()
  })

const getManagedPrefixListEntries = async ({
  ec2,
  prefixListId,
  resolveEntry,
}: {
  ec2: EC2
  prefixListId: string
  resolveEntry: () => void
}): Promise<PrefixListEntry[]> =>
  new Promise<PrefixListEntry[]>(resolve => {
    const managedPrefixListEntries: PrefixListEntry[] = []
    let args: GetManagedPrefixListEntriesRequest = {
      PrefixListId: prefixListId,
    }

    const listManagedPrefixListEntries = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.getManagedPrefixListEntries(
          args,
          (err: AWSError, data: GetManagedPrefixListEntriesResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:getManagedPrefixListEntries',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveEntry()
            }

            const { NextToken: nextToken, Entries: entries = [] } = data

            if (isEmpty(entries)) {
              return resolveEntry()
            }

            managedPrefixListEntries.push(...entries)

            logger.debug(lt.fetchedManagedPrefixListEntries(entries.length))

            if (nextToken) {
              listManagedPrefixListEntries(nextToken)
            } else {
              resolve(managedPrefixListEntries)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listManagedPrefixListEntries()
  })

/**
 * Managed Prefix List
 */

export interface RawAwsManagedPrefixList
  extends Omit<ManagedPrefixList, 'Tags'> {
  region: string
  Tags?: TagMap
  Entries?: PrefixListEntry[]
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsManagedPrefixList[]
}> =>
  new Promise(async resolve => {
    const managedPrefixListsResult: RawAwsManagedPrefixList[] = []
    const entriesPromises = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveRegion => {
        const managedPrefixLists = await listManagedPrefixListData({
          ec2,
          resolveRegion,
        })

        if (!isEmpty(managedPrefixLists)) {
          for (const managedPrefixList of managedPrefixLists) {
            managedPrefixListsResult.push({
              ...managedPrefixList,
              region,
              Tags: convertAwsTagsToTagMap(managedPrefixList.Tags as AwsTag[]),
            })
          }
        }
        resolveRegion()
      })
    })
    await Promise.all(regionPromises)

    managedPrefixListsResult.map(
      ({ PrefixListId: prefixListId, region }, idx) => {
        const ec2 = new EC2({ ...config, region, endpoint })
        const entryPromise = new Promise<void>(async resolveEntry => {
          const entries: PrefixListEntry[] =
            await getManagedPrefixListEntries({
              ec2,
              prefixListId,
              resolveEntry,
            })
          managedPrefixListsResult[idx] = {
            ...managedPrefixListsResult[idx],
            Entries: entries || [],
          }
          resolveEntry()
        })
        entriesPromises.push(entryPromise)
      }
    )
    await Promise.all(entriesPromises)

    errorLog.reset()
    resolve(groupBy(managedPrefixListsResult, 'region'))
  })
