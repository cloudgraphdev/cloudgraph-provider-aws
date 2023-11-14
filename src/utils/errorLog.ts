import CloudGraph from '@cloudgraph/sdk'
import { ProviderError } from '@cloudgraph/sdk/dist/src/types'
import { AWSError } from 'aws-sdk'

const notAuthorized = 'not authorized' // part of the error string aws passes back for permissions errors
const accessDenied = 'AccessDeniedException' // an error code aws sometimes sends back for permissions errors
const throttling = 'Throttling'
const { logger } = CloudGraph

export default class AwsErrorLog {
  // store errors for futher analysis
  static errorsHistory: ProviderError[] = []

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  private serviceName

  private functionNames: { [functionName: string]: boolean } = {}

  generateAwsErrorLog({
    functionName,
    err,
    silenceLogs,
  }: {
    functionName: string
    err?: AWSError
    silenceLogs?: boolean
  }): void {
    if (err?.statusCode === 400) {
      err.retryable = true
    }

    if (err?.code !== throttling) {
      // Verifies on function name map
      if (!this.functionNames[functionName]) {
        !silenceLogs &&
          logger.warn(
            `There was a problem getting data for service ${this.serviceName}, CG encountered an error calling ${functionName}`
          )

        AwsErrorLog.errorsHistory.push({
          service: this.serviceName,
          function: functionName,
          message: err?.message,
        })

        if (
          err?.message?.includes(notAuthorized) ||
          err?.code === accessDenied
        ) {
          logger.warn(err.message)
        }
        logger.debug(err)
        this.functionNames[functionName] = true
      }
    } else {
      logger.debug(
        `Rate exceeded for ${this.serviceName}:${functionName}. Retrying...`
      )
    }
  }

  reset(): void {
    this.functionNames = {}
  }
}
