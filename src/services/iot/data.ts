import CloudGraph from '@cloudgraph/sdk'
import IoT, {
  ThingAttribute,
  ThingAttributeList,
  ListThingsRequest,
  ListThingsResponse,
  ListTagsForResourceResponse,
  DescribeThingRequest,
  DescribeThingResponse,
} from 'aws-sdk/clients/iot'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
const lt = { ...awsLoggerText }
const {logger} = CloudGraph
const serviceName = 'IoT thing attribute'
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 250

const listThingsForRegion = async ({ iot, resolveRegion }) =>
  new Promise<ThingAttributeList>(resolve => {
    const thingAttributeList: ThingAttributeList = []
    const listThingsOpts: ListThingsRequest = {}
    const listAllThings = (token?: string) => {
      listThingsOpts.maxResults = MAX_ITEMS
      if (token) {
        listThingsOpts.nextToken = token
      }
      try {
        iot.listThings(
          listThingsOpts,
          (err: AWSError, data: ListThingsResponse) => {
            const { nextToken, things } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'iot:listThings', err)
            }
            /**
             * No IoT things for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            thingAttributeList.push(...things)

            if (nextToken) {
              logger.debug(lt.foundMoreIoTThings(things.length))
              listAllThings(nextToken)
            }

            resolve(thingAttributeList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllThings()
  })

export interface RawAwsIotThingAttribute extends ThingAttribute {
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsIotThingAttribute[] }> =>
  new Promise(async resolve => {
    const iotData: RawAwsIotThingAttribute[] = []
    const regionPromises = []
    const descriptionPromises = []

    // get all things for all regions
    regions.split(',').map(region => {
      const iot = new IoT({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const thingAttributeList = await listThingsForRegion({
          iot,
          resolveRegion,
        })
        iotData.push(
          ...thingAttributeList.map((thingAttribute: ThingAttribute) => ({
            ...thingAttribute,
            region,
          }))
        )
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    // get all information for each thing
    iotData.map(({ thingName, region }, idx) => {
      const iot = new IoT({ ...config, region, endpoint })
      const descriptionPromise = new Promise<void>(async resolveDesc => {
        const describeThingOpts: DescribeThingRequest = { thingName }
        try {
          iot.describeThing(
            describeThingOpts,
            (err: AWSError, data: DescribeThingResponse) => {
              if (err) {
                generateAwsErrorLog(serviceName, 'iot:describeThing', err)
              }
              iotData[idx] = {
                ...iotData[idx],
                ...data,
              }
              resolveDesc()
            }
          )
        } catch (error) {
          resolveDesc()
        }
      })
      descriptionPromises.push(descriptionPromise)
    })

    logger.debug(lt.gettingIoTThings)
    await Promise.all(descriptionPromises)

    resolve(groupBy(iotData, 'region'))
  })
  