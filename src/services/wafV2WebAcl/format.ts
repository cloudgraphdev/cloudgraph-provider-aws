import { Statement, TextTransformations, FieldToMatch, SearchString } from 'aws-sdk/clients/wafv2'
import { Blob } from 'buffer'
import cuid from 'cuid'
import { AwsWafV2WebAcl } from '../../types/generated'
import { RawAwsWafV2WebAcl } from './data'

/**
 * WafV2WebAcl
 */

const mapTextTransformations = (transforms: TextTransformations) => {
  return transforms.map(transform => ({
    id: cuid(),
    priority: transform.Priority,
    type: transform.Type
  }))
}

const formatSearchString = async (searchString: SearchString = ''): Promise<string> => {
  if (searchString instanceof Blob) {
    return searchString.text()
  }
  if (searchString instanceof Uint8Array) {
    return Buffer.from(searchString).toString('base64');
  }
  if (searchString instanceof Buffer) {
    return searchString.toString()
  }

  return searchString as string
}

const formatFieldToMatch = (fieldToMatch: FieldToMatch) => {
  return {
    singleHeader: {
      name: fieldToMatch?.SingleHeader?.Name
    },
    singleQueryArgument: {
      name: fieldToMatch?.SingleQueryArgument?.Name
    },
    // TODO: can we support UriPath, AllQueryArguments, QueryString, Body, Method, JsonBody?
  }
}

const formatRuleStatement = async (statement: Statement = {}) => {
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
    LabelMatchStatement
  } = statement

  const formattedByteMatchStatement = {
    searchString: await formatSearchString(ByteMatchStatement?.SearchString),
    fieldToMatch: formatFieldToMatch(ByteMatchStatement?.FieldToMatch),
    textTransformations: mapTextTransformations(ByteMatchStatement?.TextTransformations ?? []),
    positionalConstraint: ByteMatchStatement?.PositionalConstraint
  }

  const formattedSqliMatchStatement = {
    fieldToMatch: formatFieldToMatch(SqliMatchStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(SqliMatchStatement?.TextTransformations)
  }

  const formattedXssMatchStatement = {
    fieldToMatch: formatFieldToMatch(XssMatchStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(XssMatchStatement?.TextTransformations)
  }

  const formattedSizeContraint = {
    size: SizeConstraintStatement?.Size,
    comparisonOperator: SizeConstraintStatement?.ComparisonOperator,
    fieldToMatch: formatFieldToMatch(SizeConstraintStatement?.FieldToMatch),
    textTransformation: mapTextTransformations(SizeConstraintStatement?.TextTransformations)
  }

  const formattedGeoMatchStatement = {
    countryCodes: GeoMatchStatement?.CountryCodes,
    forwardedIpConfig: {
      headerName: GeoMatchStatement?.ForwardedIPConfig?.HeaderName,
      fallbackBehavior: GeoMatchStatement?.ForwardedIPConfig?.FallbackBehavior
    }
  }

  const formattedRuleGroupReferenceStatement = {
    arn: RuleGroupReferenceStatement?.ARN,
    excludedRules: RuleGroupReferenceStatement?.ExcludedRules?.map(excludedRule => ({
      id: cuid(),
      name: excludedRule.Name
    }))
  }

  const formattedIpSetReferenceStatement = {
    arn: IPSetReferenceStatement?.ARN,
    iPSetForwardedIPConfig: {
      headerName: IPSetReferenceStatement?.IPSetForwardedIPConfig?.HeaderName,
      fallbackBehavior: IPSetReferenceStatement?.IPSetForwardedIPConfig?.FallbackBehavior,
      position: IPSetReferenceStatement?.IPSetForwardedIPConfig?.Position
    }
  }

  const formattedRegexPatternSetReferenceStatement = {
    arn: RegexPatternSetReferenceStatement?.ARN,
    fieldToMatch: formatFieldToMatch(RegexPatternSetReferenceStatement?.FieldToMatch),
    textTransformations: mapTextTransformations(RegexPatternSetReferenceStatement?.TextTransformations)
  }

  const formattedRateBasedStatement = {
    limit: RateBasedStatement?.Limit,
    aggregateKeyType: RateBasedStatement?.AggregateKeyType,
    forwardedIpConfig: {
      headerName: RateBasedStatement?.ForwardedIPConfig?.HeaderName,
      fallbackBehavior: RateBasedStatement?.ForwardedIPConfig?.FallbackBehavior
    },
    statement: formatRuleStatement(RateBasedStatement?.ScopeDownStatement)
  }

  const formattedAndStatement = {
    statements: AndStatement?.Statements?.map(formatRuleStatement)
  }

  const formattedOrStatement = {
    statements: OrStatement?.Statements?.map(formatRuleStatement)
  }

  const formattedNotStatement = {
    statements: formatRuleStatement(NotStatement?.Statement)
  }

  const formattedManagedRuleGroupStatement = {
    vendorName: ManagedRuleGroupStatement?.VendorName,
    name: ManagedRuleGroupStatement?.Name,
    version: ManagedRuleGroupStatement?.Version,
    excludedRules: ManagedRuleGroupStatement?.ExcludedRules?.map(excludedRule => ({
      id: cuid(),
      name: excludedRule.Name
    })),
    scopedDownStatement: formatRuleStatement(ManagedRuleGroupStatement?.ScopeDownStatement)
  }

  const formattedLabelMatchStatement = {
    scope: LabelMatchStatement?.Scope,
    key: LabelMatchStatement?.Key
  }

  return {
    byteMatchStatement: formattedByteMatchStatement,
    sqliMatchStatement: formattedSqliMatchStatement,
    xssMatchStatement: formattedXssMatchStatement,
    sizeConstraintStatement: formattedSizeContraint,
    geoMatchStatement: formattedGeoMatchStatement,
    ruleGroupReferenceStatement: formattedRuleGroupReferenceStatement,
    iPSetReferenceStatement: formattedIpSetReferenceStatement,
    regexPatternSetReferenceStatement: formattedRegexPatternSetReferenceStatement,
    rateBasedStatement: formattedRateBasedStatement,
    andStatement: formattedAndStatement,
    orStatement: formattedOrStatement,
    notStatement: formattedNotStatement,
    managedRuleGroupStatement: formattedManagedRuleGroupStatement,
    labelMatchStatement: formattedLabelMatchStatement
  }
}

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
    Rules,
    DefaultAction,
    Capacity: capacity,
    VisibilityConfig,
    PreProcessFirewallManagerRuleGroups,
    PostProcessFirewallManagerRuleGroups,
    ManagedByFirewallManager,
    LabelNamespace: labelNamespace,
    CustomResponseBodies,
    loggingConfiguration
  } = rawData
  
  const mappedRules = Rules?.map(rule => ({
    name: rule.Name,
    priority: rule.Priority,
    statement: formatRuleStatement(rule.Statement),
    action: formatRuleAction(rule.Action),
    overrideAction: formatRuleOverrideAction(rule.OverrideAction),
    ruleLabels: formatRuleLabels(rule.RuleLabels),
    visibilityConfig: formatRuleVisibilityConfig(rule.VisibilityConfig)
  }))

  return {
    id,
    region,
    accountId: account,
    arn,
    name,
    description,
    ManagedByFirewallManager,
    capacity,
    labelNamespace,
  }
}
