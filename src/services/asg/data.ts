import * as Sentry from '@sentry/node'

import ASG, { AutoScalingGroup, LaunchConfiguration } from 'aws-sdk/clients/autoscaling'
import { groupBy, isEmpty } from 'lodash'

import CloudGraph from '@cloudgraph/sdk'

import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph

/**
 * ASG
 */

export interface RawAwsAsg extends Omit<AutoScalingGroup, 'Tags'> {
  region: string
  Tags?: TagMap
  LaunchConfiguration?: LaunchConfiguration
}

const listAsgData = async (asg: ASG): Promise<AutoScalingGroup[]> => {
  try {
    const fullResources: AutoScalingGroup[] = []

    let autoScalingGroups = await asg.describeAutoScalingGroups().promise()
    fullResources.push(...autoScalingGroups.AutoScalingGroups)
    let nextToken = autoScalingGroups.NextToken
    
    while (nextToken) {
      autoScalingGroups = await asg.describeAutoScalingGroups({NextToken: nextToken}).promise()
      fullResources.push(...autoScalingGroups.AutoScalingGroups)
      nextToken = autoScalingGroups.NextToken
    }

    return fullResources
  } catch (err) {
    logger.error(err)
    Sentry.captureException(new Error(err.message))
  }
  return null;
}

const listLaunchConfigData = async (asg: ASG): Promise<LaunchConfiguration[]> => {
  try {
    const fullResources: LaunchConfiguration[] = []

    let launchConfigurations = await asg.describeLaunchConfigurations().promise()
    fullResources.push(...launchConfigurations.LaunchConfigurations)
    let nextToken = launchConfigurations.NextToken

    while (nextToken) {
      launchConfigurations = await asg.describeLaunchConfigurations({NextToken: nextToken}).promise()
      fullResources.push(...launchConfigurations.LaunchConfigurations)
      nextToken = launchConfigurations.NextToken
    }

    logger.debug(lt.fetchedAsgs(fullResources.length))

    return fullResources
  } catch (err) {
    logger.error(err)
    Sentry.captureException(new Error(err.message))
  }
  return null;
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsAsg[]
}> => {
  const asgData = []
  let launchConfigData;

  for (const region of regions.split(',')) {
    const asg = new ASG({ region, credentials })

    /**
     * Step 1) Get all the ASG data for each region
     */
    const autoScalingGroups = await listAsgData(asg)

    asgData.push(
      ...autoScalingGroups.map((autoScalingGroup: AutoScalingGroup) => ({
        ...autoScalingGroup,
        region,
        LaunchConfiguration: {},
      }))
    )

    /**
     * Step 2) Get all the Launch Configuration data for each region
     */
    launchConfigData = await listLaunchConfigData(asg)
  }

  asgData.map(({ LaunchConfigurationName: targetLcName, Tags: tags }, idx) => {
    asgData[idx].LaunchConfiguration = {}
    if (targetLcName) {
      const launchConfig = launchConfigData.find(
        ({ LaunchConfigurationName: lcName }) => targetLcName === lcName
      )

      if (launchConfig) {
        asgData[idx].LaunchConfiguration = launchConfig
      }
    }

    if (!isEmpty(tags)) {
      asgData[idx].Tags = (tags || [])
        .map(({ Key, Value }) => ({ [Key]: Value }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }
  })

  return groupBy(asgData, 'region')
}
