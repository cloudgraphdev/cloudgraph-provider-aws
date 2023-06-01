import SES, {
  ListConfigurationSetsResponse,
  ConfigurationSet,
  ListTemplatesResponse,
  TemplateMetadata,
} from 'aws-sdk/clients/ses'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'

import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SES '
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * SES 
 */
export interface RawAwsSes {
  ConfigurationSets: ConfigurationSet[]
  EmailTemplates: TemplateMetadata[]
  region: string
}


const getEmailTemplates = async (ses: SES): Promise<TemplateMetadata[]> =>
  new Promise(resolve => {
    try {
      ses.listTemplates(
        (err: AWSError, data: ListTemplatesResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ses:listTemplates',
              err,
            })
            return resolve([])
          }
          const { TemplatesMetadata = [] } = data || {}
          resolve(TemplatesMetadata)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

const getConfigurationSets = async (ses: SES): Promise<ConfigurationSet[]> =>
  new Promise(resolve => {
    try {
      ses.listConfigurationSets(
        (err: AWSError, data: ListConfigurationSetsResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ses:listConfigurationSets',
              err,
            })
            return resolve([])
          }
          const { ConfigurationSets = [] } = data || {}
          resolve(ConfigurationSets)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSes[] }> =>
  new Promise(async resolve => {
    const sesData: RawAwsSes[] = []
    const regionPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const ses = new SES({ ...config, region, endpoint })

        const configurationSets = await getConfigurationSets(ses)
        const emailTemplates = await getEmailTemplates(ses)

        sesData.push({
          ConfigurationSets: configurationSets,
          EmailTemplates: emailTemplates,
          region
        })
        resolveRegion()


      })
      regionPromises.push(regionPromise)
    })


    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(sesData, 'region'))
  })
