import { generateUniqueId } from '@cloudgraph/sdk'

import t from '../../properties/translations'
import { AwsCognitoUserPool } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCognitoUserPool } from './data'

/**
 * Cognito User Pool
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsCognitoUserPool
  account: string
  region: string
}): AwsCognitoUserPool => {
  const {
    Id: id,
    Arn: arn,
    Name: name,
    Policies: policies,
    LambdaConfig: lambdaConfig,
    Status: status,
    LastModifiedDate: lastModifiedDate,
    CreationDate: creationDate,
    SchemaAttributes: schemaAttributes,
    AutoVerifiedAttributes: autoVerifiedAttributes,
    AliasAttributes: aliasAttributes,
    UsernameAttributes: usernameAttributes,
    SmsVerificationMessage: smsVerificationMessage,
    EmailVerificationMessage: emailVerificationMessage,
    EmailVerificationSubject: emailVerificationSubject,
    VerificationMessageTemplate: verificationMessageTemplate,
    SmsAuthenticationMessage: smsAuthenticationMessage,
    MfaConfiguration: mfaConfiguration,
    DeviceConfiguration: deviceConfiguration,
    EstimatedNumberOfUsers: estimatedNumberOfUsers,
    EmailConfiguration: emailConfiguration,
    SmsConfiguration: smsConfiguration,
    Tags: userPoolTags,
    SmsConfigurationFailure: smsConfigurationFailure,
    EmailConfigurationFailure: emailConfigurationFailure,
    Domain: domain,
    CustomDomain: customDomain,
    AdminCreateUserConfig: adminCreateUserConfig,
    UserPoolAddOns: userPoolAddOns,
    UsernameConfiguration: usernameConfiguration,
    AccountRecoverySetting: accountRecoverySetting,
  } = rawData

  const schemaAttributeList =
    schemaAttributes?.map(
      ({
        Name: schemaAttributeName,
        AttributeDataType: attributeDataType,
        DeveloperOnlyAttribute: developerOnlyAttribute,
        Mutable: mutable,
        Required: required,
        NumberAttributeConstraints: numberAttributeConstraints,
        StringAttributeConstraints: stringAttributeConstraints,
      }) => {
        return {
          id: generateUniqueId({
            arn,
            schemaAttributeName,
            attributeDataType,
            developerOnlyAttribute,
            mutable,
            required,
            numberAttributeConstraints,
            stringAttributeConstraints,
          }),
          name: schemaAttributeName,
          attributeDataType,
          developerOnlyAttribute: developerOnlyAttribute ? t.yes : t.no,
          mutable: mutable ? t.yes : t.no,
          required: required ? t.yes : t.no,
          numberAttributeConstraintsMinValue:
            numberAttributeConstraints?.MinValue || '',
          numberAttributeConstraintsMaxValue:
            numberAttributeConstraints?.MaxValue || '',
          stringAttributeConstraintsMinValue:
            stringAttributeConstraints?.MinLength || '',
          stringAttributeConstraintsMaxValue:
            stringAttributeConstraints?.MaxLength || '',
        }
      }
    ) || []

  const accountRecoverySettings =
    accountRecoverySetting?.RecoveryMechanisms?.map(
      ({ Priority: priority, Name: recoveryOptionName }) => {
        return {
          id: generateUniqueId({
            arn,
            priority,
            recoveryOptionName,
          }),
          priority,
          name: recoveryOptionName,
        }
      }
    ) || []

  const userPool = {
    id,
    accountId: account,
    arn,
    name,
    policies: {
      id: generateUniqueId({
        arn,
        ...policies,
      }),
      minimumLength: policies?.PasswordPolicy?.MinimumLength || 0,
      requireUppercase: policies?.PasswordPolicy?.RequireUppercase
        ? t.yes
        : t.no,
      requireLowercase: policies?.PasswordPolicy?.RequireLowercase
        ? t.yes
        : t.no,
      requireNumbers: policies?.PasswordPolicy?.RequireNumbers ? t.yes : t.no,
      requireSymbols: policies?.PasswordPolicy?.RequireSymbols ? t.yes : t.no,
      temporaryPasswordValidityDays:
        policies?.PasswordPolicy?.MinimumLength || 0,
    },
    lambdaConfig: {
      id: generateUniqueId({
        arn,
        ...lambdaConfig,
      }),
      preSignUp: lambdaConfig?.PreSignUp || '',
      customMessage: lambdaConfig?.CustomMessage || '',
      postConfirmation: lambdaConfig?.PostConfirmation || '',
      preAuthentication: lambdaConfig?.PreAuthentication || '',
      postAuthentication: lambdaConfig?.PostAuthentication || '',
      defineAuthChallenge: lambdaConfig?.DefineAuthChallenge || '',
      createAuthChallenge: lambdaConfig?.CreateAuthChallenge || '',
      verifyAuthChallengeResponse:
        lambdaConfig?.VerifyAuthChallengeResponse || '',
      preTokenGeneration: lambdaConfig?.PreTokenGeneration || '',
      userMigration: lambdaConfig?.UserMigration || '',
      customSMSSenderLambdaVersion:
        lambdaConfig?.CustomSMSSender?.LambdaVersion || '',
      customSMSSenderLambdaArn: lambdaConfig?.CustomSMSSender?.LambdaArn || '',
      customEmailSenderLambdaVersion:
        lambdaConfig?.CustomEmailSender?.LambdaVersion || '',
      customEmailSenderLambdaArn:
        lambdaConfig?.CustomEmailSender?.LambdaArn || '',
      kmsKeyID: lambdaConfig?.KMSKeyID || '',
    },
    status,
    lastModifiedDate: lastModifiedDate
      ? lastModifiedDate.toISOString()
      : undefined,
    creationDate: creationDate ? creationDate.toISOString() : undefined,
    schemaAttributes: schemaAttributeList,
    autoVerifiedAttributes,
    aliasAttributes,
    usernameAttributes,
    smsVerificationMessage,
    emailVerificationMessage,
    emailVerificationSubject,
    verificationMessageTemplateSmsMessage:
      verificationMessageTemplate?.SmsMessage || '',
    verificationMessageTemplateEmailMessage:
      verificationMessageTemplate?.EmailMessage || '',
    verificationMessageTemplateEmailSubject:
      verificationMessageTemplate?.EmailSubject || '',
    verificationMessageTemplateEmailMessageByLink:
      verificationMessageTemplate?.EmailMessageByLink || '',
    verificationMessageTemplateEmailSubjectByLink:
      verificationMessageTemplate?.EmailSubjectByLink || '',
    verificationMessageTemplateDefaultEmailOption:
      verificationMessageTemplate?.DefaultEmailOption || '',
    smsAuthenticationMessage,
    mfaConfiguration,
    deviceConfigChallengeRequiredOnNewDevice:
      deviceConfiguration?.ChallengeRequiredOnNewDevice ? t.yes : t.no,
    deviceConfigDeviceOnlyRememberedOnUserPrompt:
      deviceConfiguration?.DeviceOnlyRememberedOnUserPrompt ? t.yes : t.no,
    estimatedNumberOfUsers,
    emailConfigSourceArn: emailConfiguration?.SourceArn || '',
    emailConfigReplyToEmailAddress:
      emailConfiguration?.ReplyToEmailAddress || '',
    emailConfigEmailSendingAccount:
      emailConfiguration?.EmailSendingAccount || '',
    emailConfigFrom: emailConfiguration?.From || '',
    emailConfigConfigurationSet: emailConfiguration?.ConfigurationSet || '',
    smsConfigurationSnsCallerArn: smsConfiguration?.SnsCallerArn || '',
    smsConfigurationExternalId: smsConfiguration?.ExternalId || '',
    smsConfigurationFailure,
    emailConfigurationFailure,
    domain,
    customDomain,
    adminCreateUserConfigAllowAdminCreateUserOnly:
      adminCreateUserConfig?.AllowAdminCreateUserOnly ? t.yes : t.no,
    adminCreateUserConfigUnusedAccountValidityDays:
      adminCreateUserConfig?.UnusedAccountValidityDays || 0,
    adminCreateUserConfigInviteMessageTemplateSMSMessage:
      adminCreateUserConfig?.InviteMessageTemplate?.SMSMessage || '',
    adminCreateUserConfigInviteMessageTemplateEmailMessage:
      adminCreateUserConfig?.InviteMessageTemplate?.EmailMessage || '',
    adminCreateUserConfigInviteMessageTemplateEmailSubject:
      adminCreateUserConfig?.InviteMessageTemplate?.EmailSubject || '',
    userPoolAddOnsAdvancedSecurityMode:
      userPoolAddOns?.AdvancedSecurityMode || '',
    usernameConfigurationCaseSensitive: usernameConfiguration?.CaseSensitive
      ? t.yes
      : t.no,
    accountRecoverySettings,
    region,
    tags: formatTagsFromMap(userPoolTags),
  }

  return userPool
}
