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