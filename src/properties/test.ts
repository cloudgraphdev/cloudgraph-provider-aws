import environment from '../config/environment'
import { initTestEndpoint } from '../utils'

export const endpoint: string = initTestEndpoint()

// TODO: Probably solved by ENG-89
export const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

// TODO: Single region for now to match free license Localstack limitation
export const account = environment.LOCALSTACK_AWS_ACCOUNT_ID
export const region = 'us-east-1'