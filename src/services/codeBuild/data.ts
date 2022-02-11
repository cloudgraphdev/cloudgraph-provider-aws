import { Config } from 'aws-sdk/lib/config'
import CodeBuild from 'aws-sdk/clients/codebuild'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { TagMap } from '../../types'

const serviceName = 'CodeBuild'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new AwsErrorLog(serviceName)

export interface RawAwsCodeBuild extends CodeBuild.Project {
  region: string
  Tags: TagMap
}

/**
 * CodeBuild
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{[region: string]: RawAwsCodeBuild[]}> => {
  let result: RawAwsCodeBuild[] = []

  const activeRegions = regions.split(',')
  for (const region of activeRegions) {
    let codeBuildProjectNames: string[]
    try {
      codeBuildProjectNames =
        await fetchAllPaginatedData({
          getResourcesFn: convertToPromise({
            sdkContext: new CodeBuild({ ...config, region, endpoint }),
            fnName: 'listProjects',
          }),
          accessor: '',
        })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'codebuild:listProjects',
        err,
      })
    }

    if (!isEmpty(codeBuildProjectNames)) {
      let codeBuildData: CodeBuild.Project[] = []
      try {
        codeBuildData = await fetchAllPaginatedData({
          getResourcesFn: convertToPromise({
            sdkContext: new CodeBuild({ ...config, region, endpoint }),
            fnName: 'batchGetProjects'
          }),
          initialParams: {
            names: codeBuildProjectNames
          },
          accessor: ''
        })
      } catch (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'codebuild:batchGetProjects',
          err,
        })
      }
  
      result = codeBuildData.map(project => ({
        region,
        ...project,
        Tags: project.tags.reduce((prev, curr) => {
          const copy = prev
          copy[curr.key] = curr.value
          return copy
        }, {}) as TagMap
      }))
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
