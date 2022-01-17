import { Config } from 'aws-sdk'
import EFS, {
  FileSystemDescription,
  DescribeFileSystemsRequest,
  DescribeFileSystemsResponse,
} from 'aws-sdk/clients/efs'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EFS'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listFileSystems = async ({
  efs,
  region,
  token: Marker = '',
  resolveRegion,
}: {
  efs: EFS
  region: string
  token?: string
  resolveRegion: Function
}): Promise<FileSystemDescription[]> =>
  new Promise<FileSystemDescription[]>(resolve => {
    const efsList: FileSystemDescription[] = []
    let args: DescribeFileSystemsRequest = {}

    if (Marker) {
      args = { ...args, Marker }
    }

    try {
      efs.describeFileSystems(
        args,
        (err: AWSError, data: DescribeFileSystemsResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'efs:describeFileSystems',
              err,
            })
          }

          /**
           * No EFS data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const {
            FileSystems: fileSystems = [],
            NextMarker: token,
          }: { FileSystems?: any; NextMarker?: any } = data

          efsList.push(...fileSystems)

          logger.debug(lt.fetchedEfs(fileSystems.length))

          /**
           * No EFSs Found
           */

          if (isEmpty(fileSystems)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listFileSystems({ region, token, efs, resolveRegion })
          }

          resolve(efsList)

          /**
           * If this is the last page of data then return
           */

          if (!token) {
            resolveRegion()
          }
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export interface RawAwsEfs extends Omit<FileSystemDescription, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEfs[]
}> =>
  new Promise(async resolve => {
    const efsFileSystems: RawAwsEfs[] = []
    const regionPromises = []

    /**
     * Get all the EFS File Systems
     */

    regions.split(',').map(region => {
      const efs = new EFS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const efsList = await listFileSystems({ efs, region, resolveRegion })
        if (!isEmpty(efsList)) {
          efsFileSystems.push(
            ...efsList.map(efs => ({
              ...efs,
              region,
              Tags: convertAwsTagsToTagMap(efs.Tags),
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(efsFileSystems, 'region'))
  })
