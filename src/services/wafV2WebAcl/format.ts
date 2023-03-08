import isEmpty from 'lodash/isEmpty'
import { generateUniqueId } from '@cloudgraph/sdk'

import {
  formatFieldToMatch,
  formatRuleLabels,
  formatRuleStatement,
  formatRuleAction,
  formatRuleOverrideAction,
  formatDefaultAction,
  formatFirewallManagerRuleGroups,
  formatVisibilityConfig,
} from './utils'
import { AwsWafV2WebAcl } from '../../types/generated'
import { RawAwsWafV2WebAcl } from './data'

/**
 * WafV2WebAcl
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsWafV2WebAcl
  region: string
}): AwsWafV2WebAcl => {
  const {
    Id: id,
    ARN: arn,
    Name: name,
    Description: description,
    scope,
    Rules,
    DefaultAction,
    Capacity: capacity,
    VisibilityConfig,
    PreProcessFirewallManagerRuleGroups,
    PostProcessFirewallManagerRuleGroups,
    ManagedByFirewallManager,
    LabelNamespace: labelNamespace,
    CustomResponseBodies,
    loggingConfiguration,
  } = rawData

  const mappedRules = Rules?.map(rule => ({
    id: generateUniqueId({
      ...rule,
    }),
    name: rule.Name,
    priority: rule.Priority,
    statement: formatRuleStatement(rule.Statement),
    action: formatRuleAction(rule.Action),
    overrideAction: formatRuleOverrideAction(rule.OverrideAction),
    ruleLabels: formatRuleLabels(rule.RuleLabels),
    visibilityConfig: formatVisibilityConfig(rule.VisibilityConfig),
  }))

  const mappedCustomResponseBodies = Object.keys(
    CustomResponseBodies ?? {}
  ).map(key => ({
    id: generateUniqueId({
      key,
      contentType: CustomResponseBodies[key]?.ContentType,
      content: CustomResponseBodies[key]?.Content,
    }),
    key,
    contentType: CustomResponseBodies[key]?.ContentType,
    content: CustomResponseBodies[key]?.Content,
  }))

  const formattedLoggingConfig = isEmpty(loggingConfiguration ?? {})
    ? {
        resourceArn: loggingConfiguration?.ResourceArn,
        logDestinationConfigs: loggingConfiguration?.LogDestinationConfigs,
        redactedFields:
          loggingConfiguration?.RedactedFields?.map(formatFieldToMatch),
        managedByFirewallManager:
          loggingConfiguration?.ManagedByFirewallManager,
        loggingFilter: {
          filters: loggingConfiguration?.LoggingFilter?.Filters?.map(
            filter => ({
              id: generateUniqueId({
                ...loggingConfiguration,
              }),
              behavior: filter.Behavior,
              requirement: filter.Requirement,
              conditions: filter.Conditions?.map(condition => ({
                id: generateUniqueId({
                  action: condition?.ActionCondition?.Action,
                  labelName: condition?.LabelNameCondition?.LabelName,
                }),
                actionCondtion: {
                  action: condition?.ActionCondition?.Action,
                },
                labelNameCondition: {
                  labelName: condition?.LabelNameCondition?.LabelName,
                },
              })),
            })
          ),
          defaultBehavior: loggingConfiguration?.LoggingFilter?.DefaultBehavior,
        },
      }
    : null

  return {
    id,
    region,
    accountId: account,
    arn,
    name,
    scope,
    description,
    ManagedByFirewallManager,
    capacity,
    labelNamespace,
    rules: mappedRules,
    defaultAction: formatDefaultAction(DefaultAction),
    visibilityConfig: formatVisibilityConfig(VisibilityConfig),
    preProcessFirewallManagerRuleGroups: formatFirewallManagerRuleGroups(
      PreProcessFirewallManagerRuleGroups
    ),
    postProcessFirewallManagerRuleGroups: formatFirewallManagerRuleGroups(
      PostProcessFirewallManagerRuleGroups
    ),
    customResponseBodies: mappedCustomResponseBodies,
    loggingConfiguration: formattedLoggingConfig,
  }
}
