import { generateId } from '@cloudgraph/sdk'
import { AwsEcsTaskDefinition } from '../../types/generated'
import { RawAwsEcsTaskDefinition } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEcsTaskDefinition
  account: string
  region: string
}): AwsEcsTaskDefinition => {
  const {
    taskDefinitionArn: arn,
    family,
    taskRoleArn,
    executionRoleArn,
    networkMode,
    revision,
    volumes,
    status,
    requiresAttributes,
    placementConstraints,
    compatibilities,
    requiresCompatibilities,
    cpu,
    memory,
    inferenceAccelerators,
    pidMode,
    ipcMode,
    proxyConfiguration,
    registeredAt,
    deregisteredAt,
    registeredBy,
    ephemeralStorage,
  } = service

  const containerDefinitions = service.containerDefinitions?.map(def => ({
    id: generateId(def as Record<string, unknown>),
    ...def,
    portMappings: def.portMappings?.map(mapping => ({
      id: generateId(mapping as Record<string, unknown>),
      ...mapping,
    })),
    environment: def.environment?.map(env => ({
      id: generateId(env as Record<string, unknown>),
      ...env,
    })),
    environmentFiles: def.environmentFiles?.map(file => ({
      id: generateId(file as unknown as Record<string, unknown>),
      ...file,
    })),
    mountPoints: def.mountPoints?.map(mp => ({
      id: generateId(mp as Record<string, unknown>),
      ...mp,
    })),
    volumesFrom: def.volumesFrom?.map(vol => ({
      id: generateId(vol as Record<string, unknown>),
      ...vol,
    })),
    linuxParameters: {
      ...def?.linuxParameters,
      devices: def.linuxParameters?.devices?.map(device => ({
        id: generateId(device as unknown as Record<string, unknown>),
        ...device,
      })),
      tmpfs: def.linuxParameters?.tmpfs?.map(fs => ({
        id: generateId(fs as unknown as Record<string, unknown>),
        ...fs,
      }))
    },
    secrets: def.secrets?.map(secret => ({
      id: generateId(secret as unknown as Record<string, unknown>),
      ...secret,
    })),
    dependsOn: def.dependsOn?.map(dep => ({
      id: generateId(dep as unknown as Record<string, unknown>),
      ...dep,
    })),
    extraHosts: def.extraHosts?.map(host => ({
      id: generateId(host as unknown as Record<string, unknown>),
      ...host,
    })),
    dockerLabels: Object.keys(def.dockerLabels || {}).map(key => ({
      id: generateId({ key, value: def.dockerLabels[key]}),
      key,
      value: def.dockerLabels[key],
    })),
    ulimits: def.ulimits?.map(ulimit => ({
      id: generateId(ulimit as unknown as Record<string, unknown>),
      ...ulimit,
    })),
    logConfiguration: {
      ...def.logConfiguration,
      options: Object.keys(def.logConfiguration?.options || {}).map(key => ({
        id: generateId({ key, value: def.logConfiguration?.options?.[key]}),
        key,
        value: def.logConfiguration?.options?.[key],
      })),
      secretOptions: def.logConfiguration?.secretOptions?.map(option => ({
        id: generateId(option as unknown as Record<string, unknown>),
        ...option,
      }))
    },
    systemControls: def.systemControls?.map(control => ({
      id: generateId(control as unknown as Record<string, unknown>),
      ...control,
    })),
    resourceRequirements: def.resourceRequirements?.map(rr => ({
      id: generateId(rr as unknown as Record<string, unknown>),
      ...rr,
    })),
    firelensConfiguration: {
      ...def.firelensConfiguration,
      options: Object.keys(def.firelensConfiguration?.options || {}).map(key => ({
        id: generateId({ key, value: def.firelensConfiguration?.options[key] }),
        key,
        value: def.firelensConfiguration?.options[key],
      })),
    },
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    containerDefinitions,
    family,
    taskRoleArn,
    executionRoleArn,
    networkMode,
    revision,
    volumes: volumes?.map(vol => ({
      id: generateId(vol as unknown as Record<string, unknown>),
      ...vol,
      dockerVolumeConfiguration: {
        driverOpts: Object.keys(vol?.dockerVolumeConfiguration?.driverOpts).map(key => ({
          id: generateId({ key, value: vol?.dockerVolumeConfiguration?.driverOpts[key]}),
          key,
          value: vol?.dockerVolumeConfiguration?.driverOpts[key],
        })),
        labels: Object.keys(vol?.dockerVolumeConfiguration?.labels).map(key => ({
          id: generateId({ key, value: vol?.dockerVolumeConfiguration?.labels[key]}),
          key,
          value: vol?.dockerVolumeConfiguration?.labels[key],
        })),
      },
    })),
    status,
    requiresAttributes: requiresAttributes?.map(attr => ({
      id: generateId(attr as unknown as Record<string, unknown>),
      ...attr,
    })),
    placementConstraints: placementConstraints?.map(pc => ({
      id: generateId(pc as unknown as Record<string, unknown>),
      ...pc,
    })),
    compatibilities,
    requiresCompatibilities,
    cpu,
    memory,
    inferenceAccelerators: inferenceAccelerators?.map(ia => ({
      id: generateId(ia as unknown as Record<string, unknown>),
      ...ia,
    })),
    pidMode,
    ipcMode,
    proxyConfiguration: {
      ...proxyConfiguration,
      properties: proxyConfiguration?.properties?.map(prop => ({
        id: generateId(prop as unknown as Record<string, unknown>),
        ...prop,
      })),
    },
    registeredAt: registeredAt?.toISOString(),
    deregisteredAt: deregisteredAt?.toISOString(),
    registeredBy,
    ephemeralStorage,
  }
}