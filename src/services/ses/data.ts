import SES, {
  ListConfigurationSetsResponse,
  ConfigurationSet,
  ListTemplatesResponse,
  TemplateMetadata,
} from 'aws-sdk/clients/ses'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'

import groupBy from 'lodash/groupBy'

import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { isEmpty } from 'lodash'

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
    const templates: TemplateMetadata[] = []
    const listTemplates = (nextToken?: string): void => {
      try {
        ses.listTemplates(
          { NextToken: nextToken },
          (err: AWSError, data: ListTemplatesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ses:listTemplates',
                err,
              })
              return resolve([])
            }
            const { TemplatesMetadata = [] } = data || {}
            templates.push(...TemplatesMetadata)
            if (data?.NextToken) {
              listTemplates(data.NextToken)
            } else {
              resolve(templates)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listTemplates()
  })

const getConfigurationSets = async (ses: SES): Promise<ConfigurationSet[]> =>
  new Promise(resolve => {
    const configurationSets: ConfigurationSet[] = []
    const listConfigurationSets = (nextToken?: string): void => {
      try {
        ses.listConfigurationSets(
          { NextToken: nextToken },
          (err: AWSError, data: ListConfigurationSetsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ses:listConfigurationSets',
                err,
              })
              return resolve([])
            }
            if (isEmpty(data?.ConfigurationSets)) {
              return resolve([])
            }
            configurationSets.push(...data.ConfigurationSets)
            if (data?.NextToken) {
              listConfigurationSets(data.NextToken)
            } else {
              resolve(configurationSets)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listConfigurationSets()
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
          region,
        })
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(sesData, 'region'))
  })
