import cuid from 'cuid'
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
    id: cuid(),
    ...def,
    portMappings: def.portMappings?.map(mapping => ({
      id: cuid(),
      ...mapping,
    })),
    environment: def.environment?.map(env => ({
      id: cuid(),
      ...env,
    })),
    environmentFiles: def.environmentFiles?.map(file => ({
      id: cuid(),
      ...file,
    })),
    mountPoints: def.mountPoints?.map(mp => ({
      id: cuid(),
      ...mp,
    })),
    volumesFrom: def.volumesFrom?.map(vol => ({
      id: cuid(),
      ...vol,
    })),
    linuxParameters: {
      ...def?.linuxParameters,
      devices: def.linuxParameters?.devices?.map(device => ({
        id: cuid(),
        ...device,
      })),
      tmpfs: def.linuxParameters?.tmpfs?.map(fs => ({
        id: cuid(),
        ...fs,
      }))
    },
    secrets: def.secrets?.map(secret => ({
      id: cuid(),
      ...secret,
    })),
    dependsOn: def.dependsOn?.map(dep => ({
      id: cuid(),
      ...dep,
    })),
    extraHosts: def.extraHosts?.map(host => ({
      id: cuid(),
      ...host,
    })),
    dockerLabels: Object.keys(def.dockerLabels || {}).map(key => ({
      id: cuid(),
      key,
      value: def.dockerLabels[key],
    })),
    ulimits: def.ulimits?.map(ulimit => ({
      id: cuid(),
      ...ulimit,
    })),
    logConfiguration: {
      ...def.logConfiguration,
      options: Object.keys(def.logConfiguration?.options || {}).map(key => ({
        id: cuid(),
        key,
        value: def.logConfiguration?.options[key],
      })),
      secretOptions: def.logConfiguration?.secretOptions?.map(option => ({
        id: cuid(),
        ...option,
      }))
    },
    systemControls: def.systemControls?.map(control => ({
      id: cuid(),
      ...control,
    })),
    resourceRequirements: def.resourceRequirements?.map(rr => ({
      id: cuid(),
      ...rr,
    })),
    firelensConfiguration: {
      ...def.firelensConfiguration,
      options: Object.keys(def.firelensConfiguration?.options || {}).map(key => ({
        id: cuid(),
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
      id: cuid(),
      ...vol,
      dockerVolumeConfiguration: {
        driverOpts: Object.keys(vol?.dockerVolumeConfiguration?.driverOpts).map(key => ({
          id: cuid(),
          key,
          value: vol?.dockerVolumeConfiguration?.driverOpts[key],
        })),
        labels: Object.keys(vol?.dockerVolumeConfiguration?.labels).map(key => ({
          id: cuid(),
          key,
          value: vol?.dockerVolumeConfiguration?.labels[key],
        })),
      },
    })),
    status,
    requiresAttributes: requiresAttributes?.map(attr => ({
      id: cuid(),
      ...attr,
    })),
    placementConstraints: placementConstraints?.map(pc => ({
      id: cuid(),
      ...pc,
    })),
    compatibilities,
    requiresCompatibilities,
    cpu,
    memory,
    inferenceAccelerators: inferenceAccelerators?.map(ia => ({
      id: cuid(),
      ...ia,
    })),
    pidMode,
    ipcMode,
    proxyConfiguration: {
      ...proxyConfiguration,
      properties: proxyConfiguration?.properties?.map(prop => ({
        id: cuid(),
        ...prop,
      })),
    },
    registeredAt: registeredAt?.toISOString(),
    deregisteredAt: deregisteredAt?.toISOString(),
    registeredBy,
    ephemeralStorage,
  }
}