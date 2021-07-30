import dotenv from 'dotenv'

const { parsed: environment } = dotenv.config()

export default {
  ...process.env,
  ...environment,
}
