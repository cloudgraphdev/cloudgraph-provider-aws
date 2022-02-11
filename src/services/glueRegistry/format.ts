import { AwsGlueRegistry } from '../../types/generated'
import { RawAwsGlueRegistry } from './data'

/**
 * GlueRegistry
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsGlueRegistry
  region: string
}): AwsGlueRegistry => {
  const {
    RegistryName: registryName,
    RegistryArn: registryArn,
    Status: status,
    CreatedTime: createdTime,
    UpdatedTime: updatedTime,
    schemas,
  } = rawData

  const mappedSchemas = schemas.map(
    ({
      SchemaName: schemaName,
      SchemaArn: arn,
      Description: description,
      SchemaStatus: schemaStatus,
      CreatedTime: schemaCreatedTime,
    }) => ({
      id: arn,
      schemaName,
      registryName,
      registryArn,
      arn,
      description,
      schemaStatus,
      createdTime: schemaCreatedTime
    })
  )
  return {
    id: registryArn,
    arn: registryArn,
    region,
    accountId: account,
    registryName,
    status,
    createdTime,
    updatedTime,
    schemas: mappedSchemas
  }
}
