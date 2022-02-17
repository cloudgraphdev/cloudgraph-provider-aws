import {
  Statement,
  TextTransformations,
  FieldToMatch,
  SearchString,
  RuleAction,
  OverrideAction,
  Labels,
  VisibilityConfig,
  DefaultAction,
  FirewallManagerRuleGroups,
} from 'aws-sdk/clients/wafv2'
import { Blob } from 'buffer'
import cuid from 'cuid'

/**
 * WafV2WebAcl
 */

export const mapTextTransformations = (transforms: TextTransformations = []) => {
  return transforms.map(transform => ({
    id: cuid(),
    priority: transform.Priority,
    type: transform.Type,
  }))
}

export const formatSearchString = async (
  searchString: SearchString = ''
): Promise<string> => {
  if (searchString instanceof Blob) {
    return searchString.text()
  }
  if (searchString instanceof Uint8Array) {
    return Buffer.from(searchString).toString('base64')
  }
  if (searchString instanceof Buffer) {
    return searchString.toString()
  }

  return searchString as string
}

export const formatFieldToMatch = (fieldToMatch: FieldToMatch) => {
  return {
    id: cuid(),
    singleHeader: {
      name: fieldToMatch?.SingleHeader?.Name,
    },
    singleQueryArgument: {
      name: fieldToMatch?.SingleQueryArgument?.Name,
    },
    // TODO: can we support UriPath, AllQueryArguments, QueryString, Body, Method, JsonBody?
  }
}

export const formatRuleStatement = async (statement: Statement = {}) => {
  const {
    ByteMatchStatement,
    SqliMatchStatement,
    XssMatchStatement,
    SizeConstraintStatement,
    GeoMatchStatement,
    RuleGroupReferenceStatement,
    IPSetReferenceStatement,
    RegexPatternSetReferenceStatement,
    RateBasedStatement,
    AndStatement,
    OrStatement,
    NotStatement,
    ManagedRuleGroupStatement,
    LabelMatchStatement,
  } = statement

  const formattedByteMatchStatement = {
    searchString: await formatSearchString(ByteMatchStatement?.SearchString),
    fieldToMatch: formatFieldToMatch(ByteMatchStatement?.FieldToMatch),
    textTransformations: mapTextTransformations(
      ByteMatchStatement?.TextTransformations ?? []
    ),
    positionalConstraint: ByteMatchStatement?.PositionalConstraint,
  }

  const formattedSqliMatchStatement = {
    fieldToMatch: formatFieldToMatch(SqliMatchStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(
      SqliMatchStatement?.TextTransformations
    ),
  }

  const formattedXssMatchStatement = {
    fieldToMatch: formatFieldToMatch(XssMatchStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(
      XssMatchStatement?.TextTransformations
    ),
  }

  const formattedSizeContraint = {
    size: SizeConstraintStatement?.Size,
    comparisonOperator: SizeConstraintStatement?.ComparisonOperator,
    fieldToMatch: formatFieldToMatch(SizeConstraintStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(
      SizeConstraintStatement?.TextTransformations
    ),
  }

  const formattedGeoMatchStatement = {
    countryCodes: GeoMatchStatement?.CountryCodes,
    forwardedIpConfig: {
      headerName: GeoMatchStatement?.ForwardedIPConfig?.HeaderName,
      fallbackBehavior: GeoMatchStatement?.ForwardedIPConfig?.FallbackBehavior,
    },
  }

  const formattedRuleGroupReferenceStatement = {
    arn: RuleGroupReferenceStatement?.ARN,
    excludedRules: RuleGroupReferenceStatement?.ExcludedRules?.map(
      excludedRule => ({
        id: cuid(),
        name: excludedRule.Name,
      })
    ),
  }

  const formattedIpSetReferenceStatement = {
    arn: IPSetReferenceStatement?.ARN,
    iPSetForwardedIPConfig: {
      headerName: IPSetReferenceStatement?.IPSetForwardedIPConfig?.HeaderName,
      fallbackBehavior:
        IPSetReferenceStatement?.IPSetForwardedIPConfig?.FallbackBehavior,
      position: IPSetReferenceStatement?.IPSetForwardedIPConfig?.Position,
    },
  }

  const formattedRegexPatternSetReferenceStatement = {
    arn: RegexPatternSetReferenceStatement?.ARN,
    fieldToMatch: formatFieldToMatch(
      RegexPatternSetReferenceStatement?.FieldToMatch
    ),
    textTransformations: mapTextTransformations(
      RegexPatternSetReferenceStatement?.TextTransformations
    ),
  }

  const formattedRateBasedStatement = {
    limit: RateBasedStatement?.Limit,
    aggregateKeyType: RateBasedStatement?.AggregateKeyType,
    forwardedIpConfig: {
      headerName: RateBasedStatement?.ForwardedIPConfig?.HeaderName,
      fallbackBehavior: RateBasedStatement?.ForwardedIPConfig?.FallbackBehavior,
    },
    statement: formatRuleStatement(RateBasedStatement?.ScopeDownStatement),
  }

  const formattedAndStatement = {
    statements: AndStatement?.Statements?.map(formatRuleStatement),
  }

  const formattedOrStatement = {
    statements: OrStatement?.Statements?.map(formatRuleStatement),
  }

  const formattedNotStatement = {
    statements: formatRuleStatement(NotStatement?.Statement),
  }

  const formattedManagedRuleGroupStatement = {
    vendorName: ManagedRuleGroupStatement?.VendorName,
    name: ManagedRuleGroupStatement?.Name,
    version: ManagedRuleGroupStatement?.Version,
    excludedRules: ManagedRuleGroupStatement?.ExcludedRules?.map(
      excludedRule => ({
        id: cuid(),
        name: excludedRule.Name,
      })
    ),
    scopedDownStatement: formatRuleStatement(
      ManagedRuleGroupStatement?.ScopeDownStatement
    ),
  }

  const formattedLabelMatchStatement = {
    scope: LabelMatchStatement?.Scope,
    key: LabelMatchStatement?.Key,
  }

  return {
    id: cuid(),
    byteMatchStatement: formattedByteMatchStatement,
    sqliMatchStatement: formattedSqliMatchStatement,
    xssMatchStatement: formattedXssMatchStatement,
    sizeConstraintStatement: formattedSizeContraint,
    geoMatchStatement: formattedGeoMatchStatement,
    ruleGroupReferenceStatement: formattedRuleGroupReferenceStatement,
    iPSetReferenceStatement: formattedIpSetReferenceStatement,
    regexPatternSetReferenceStatement:
      formattedRegexPatternSetReferenceStatement,
    rateBasedStatement: formattedRateBasedStatement,
    andStatement: formattedAndStatement,
    orStatement: formattedOrStatement,
    notStatement: formattedNotStatement,
    managedRuleGroupStatement: formattedManagedRuleGroupStatement,
    labelMatchStatement: formattedLabelMatchStatement,
  }
}

export const formatRuleAction = (action: RuleAction = {}) => {
  const { Block, Allow, Count } = action

  const block = {
    customResponse: {
      responseCode: Block?.CustomResponse?.ResponseCode,
      customResponseBodyKey: Block?.CustomResponse?.CustomResponseBodyKey,
      responseHeaders: Block?.CustomResponse?.ResponseHeaders?.map(header => ({
        id: cuid(),
        name: header.Name,
        value: header.Value,
      })),
    },
  }

  const allow = {
    customRequestHandling: {
      insertHeaders: Allow?.CustomRequestHandling?.InsertHeaders?.map(
        header => ({
          id: cuid(),
          name: header.Name,
          value: header.Value,
        })
      ),
    },
  }

  const count = {
    customRequestHandling: {
      insertHeaders: Count?.CustomRequestHandling?.InsertHeaders?.map(
        header => ({
          id: cuid(),
          name: header.Name,
          value: header.Value,
        })
      ),
    },
  }

  return {
    block,
    allow,
    count,
  }
}

export const formatRuleOverrideAction = (action: OverrideAction = {}) => {
  const { Count, None } = action

  const count = {
    customRequestHandling: {
      insertHeaders: Count?.CustomRequestHandling?.InsertHeaders?.map(
        header => ({
          id: cuid(),
          name: header.Name,
          value: header.Value,
        })
      ),
    },
  }

  const none = !!None

  return {
    count,
    none,
  }
}

export const formatRuleLabels = (labels: Labels) => {
  return labels?.map(label => ({
    id: cuid(),
    name: label.Name,
  }))
}

export const formatVisibilityConfig = (config: VisibilityConfig) => {
  return {
    sampledRequestsEnabled: config?.SampledRequestsEnabled,
    cloudWatchMetricsEnabled: config?.CloudWatchMetricsEnabled,
    metricName: config?.MetricName,
  }
}

export const formatDefaultAction = (action: DefaultAction = {}) => {
  const { Block, Allow } = action

  const block = {
    customResponse: {
      responseCode: Block?.CustomResponse?.ResponseCode,
      customResponseBodyKey: Block?.CustomResponse?.CustomResponseBodyKey,
      responseHeaders: Block?.CustomResponse?.ResponseHeaders?.map(header => ({
        id: cuid(),
        name: header.Name,
        value: header.Value,
      })),
    },
  }

  const allow = {
    customRequestHandling: {
      insertHeaders: Allow?.CustomRequestHandling?.InsertHeaders?.map(
        header => ({
          id: cuid(),
          name: header.Name,
          value: header.Value,
        })
      ),
    },
  }

  return {
    block,
    allow,
  }
}

export const formatFirewallManagerRuleGroups = (
  ruleGroups: FirewallManagerRuleGroups
) => {
  return ruleGroups?.map(ruleGroup => ({
    id: cuid(),
    name: ruleGroup.Name,
    priority: ruleGroup.Priority,
    firewallManagerStatement: {
      managedRuleGroupStatement: {
        vendorName:
          ruleGroup?.FirewallManagerStatement?.ManagedRuleGroupStatement
            ?.VendorName,
        name: ruleGroup?.FirewallManagerStatement?.ManagedRuleGroupStatement
          ?.Name,
        version:
          ruleGroup?.FirewallManagerStatement?.ManagedRuleGroupStatement
            ?.Version,
        excludedRules:
          ruleGroup?.FirewallManagerStatement?.ManagedRuleGroupStatement?.ExcludedRules?.map(
            excludedRule => ({
              id: cuid(),
              name: excludedRule.Name,
            })
          ),
        scopedDownStatement: formatRuleStatement(
          ruleGroup?.FirewallManagerStatement?.ManagedRuleGroupStatement
            ?.ScopeDownStatement
        ),
      },
      ruleGroupReferenceStatement: {
        arn: ruleGroup?.FirewallManagerStatement?.RuleGroupReferenceStatement
          ?.ARN,
        excludedRules:
          ruleGroup?.FirewallManagerStatement?.RuleGroupReferenceStatement?.ExcludedRules?.map(
            excludedRule => ({
              id: cuid(),
              name: excludedRule.Name,
            })
          ),
      },
    },
    overrideAction: formatRuleOverrideAction(ruleGroup?.OverrideAction),
    visibilityConfig: formatVisibilityConfig(ruleGroup?.VisibilityConfig),
  }))
}