import {
  CodeCommitClient,
  ListRepositoriesCommand,
  ListRepositoriesInput,
  RepositoryNameIdPair,
} from '@aws-sdk/client-codecommit'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph

const serviceName = 'Code Commit Repository'
const errorLog = new AwsErrorLog(serviceName)

export interface RawAwsRepository extends RepositoryNameIdPair {
  region: string
}

const listRepositories = async (
  cc: CodeCommitClient
): Promise<RepositoryNameIdPair[]> =>
  new Promise(async resolve => {
    const ccRepositories: RepositoryNameIdPair[] = []

    const input: ListRepositoriesInput = {}

    const listAllRepositories = (token?: string): void => {
      if (token) {
        input.nextToken = token
      }
      const command = new ListRepositoriesCommand(input)
      cc.send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { repositories = [], nextToken } = data || {}

          ccRepositories.push(...repositories)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllRepositories(nextToken)
          } else {
            resolve(ccRepositories)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'codecommit:listRepositories',
            err,
          })
          resolve([])
        })
    }
    listAllRepositories()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRepository[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const repositoriesData: RawAwsRepository[] = []

    const regionPromises = regions.split(',').map(region => {
      const cc = new CodeCommitClient({
        credentials,
        region,
      })
      return new Promise<void>(async resolveRegion => {
        const repos = (await listRepositories(cc)) || []
        if (!isEmpty(repos))
          repositoriesData.push(...repos.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(repositoriesData, 'region'))
  })
