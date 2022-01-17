import { Config } from 'aws-sdk'
import EFS, {
  MountTargetDescription,
  DescribeMountTargetsResponse,
} from 'aws-sdk/clients/efs'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import flatMap from 'lodash/flatMap'
import uniqBy from 'lodash/uniqBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import EfsClass from '../efs'
import { RawAwsEfs } from '../efs/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EFS mount target'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEfsMountTarget extends MountTargetDescription {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEfsMountTarget[]
}> =>
  new Promise(async resolve => {
    const efsMountTargets: RawAwsEfsMountTarget[] = []
    const efsClass = new EfsClass({ logger: CloudGraph.logger })
    const efsResult = await efsClass.getData({
      ...config,
      regions,
    })
    const efsFileSystems: RawAwsEfs[] = flatMap(efsResult)
    const regionPromises = []

    regions.split(',').map(region => {
      efsFileSystems.map(efs => {
        const regionPromise = new Promise<void>(resolveMountTargets =>
          new EFS({
            ...config,
            region: efs.region,
            endpoint,
          }).describeMountTargets(
            { FileSystemId: efs.FileSystemId },
            async (err: AWSError, data: DescribeMountTargetsResponse) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'efs:describeMountTargets',
                  err,
                })
              }

              if (isEmpty(data)) {
                return resolveMountTargets()
              }

              const { MountTargets: mountTargets = [] } = data || {}

              logger.debug(lt.fetchedEfsMountTargets(mountTargets.length))

              if (!isEmpty(mountTargets)) {
                efsMountTargets.push(
                  ...mountTargets.map(target => ({
                    region,
                    ...target,
                  }))
                )
              }
              resolveMountTargets()
            }
          )
        )
        regionPromises.push(regionPromise)
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(uniqBy(efsMountTargets, 'MountTargetId'), 'region'))
  })
