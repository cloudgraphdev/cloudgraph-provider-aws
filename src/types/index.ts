export interface Credentials {
  accessKeyId: string
  sessionToken?: string
  secretAccessKey: string
}

export interface AwsTag {
  Key: string
  Value: string
}

export interface TagMap {
  [property: string]: string
}

export interface RawAwsService {
  cgId: string
  accountId: string
}

export interface RawAwsIamJsonPolicyStatementCondition {
  // Condition operator
  [key: string]: {
    // Condition key: Condition value
    [key: string]: string | number | string[] | number []
  }
}

export interface RawAwsIamJsonPolicyStatementPrincipal {
  [key: string]: string[]
}

export interface RawAwsIamJsonPolicyStatement {
  Sid?: string
  Condition?: RawAwsIamJsonPolicyStatementCondition
  Effect: string
  Principal?: RawAwsIamJsonPolicyStatementPrincipal
  NotPrincipal?: RawAwsIamJsonPolicyStatementPrincipal
  Action?: string[]
  NotAction?: string[]
  Resource?: string[]
  NotResource?: string[]
}

export interface RawAwsIamJsonPolicy {
  Version: string
  Id?: string
  Statement: RawAwsIamJsonPolicyStatement[]
}

export * from './generated'