import { generateUniqueId } from '@cloudgraph/sdk'
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
    id: generateUniqueId({
      arn,
      ...def,
    }),
    ...def,
    portMappings: def.portMappings?.map(mapping => ({
      id: generateUniqueId({
        arn,
        ...mapping,
      }),
      ...mapping,
    })),
    environment: def.environment?.map(env => ({
      id: generateUniqueId({
        arn,
        ...env,
      }),
      ...env,
    })),
    environmentFiles: def.environmentFiles?.map(file => ({
      id: generateUniqueId({
        arn,
        ...file,
      }),
      ...file,
    })),
    mountPoints: def.mountPoints?.map(mp => ({
      id: generateUniqueId({
        arn,
        ...mp,
      }),
      ...mp,
    })),
    volumesFrom: def.volumesFrom?.map(vol => ({
      id: generateUniqueId({
        arn,
        ...vol,
      }),
      ...vol,
    })),
    linuxParameters: {
      ...def?.linuxParameters,
      devices: def.linuxParameters?.devices?.map(device => ({
        id: generateUniqueId({
          arn,
          ...device,
        }),
        ...device,
      })),
      tmpfs: def.linuxParameters?.tmpfs?.map(fs => ({
        id: generateUniqueId({
          arn,
          ...fs,
        }),
        ...fs,
      })),
    },
    secrets: def.secrets?.map(secret => ({
      id: generateUniqueId({
        arn,
        ...secret,
      }),
      ...secret,
    })),
    dependsOn: def.dependsOn?.map(dep => ({
      id: generateUniqueId({
        arn,
        ...dep,
      }),
      ...dep,
    })),
    extraHosts: def.extraHosts?.map(host => ({
      id: generateUniqueId({
        arn,
        ...host,
      }),
      ...host,
    })),
    dockerLabels: Object.keys(def.dockerLabels || {}).map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: def.dockerLabels[key],
      }),
      key,
      value: def.dockerLabels[key],
    })),
    ulimits: def.ulimits?.map(ulimit => ({
      id: generateUniqueId({
        arn,
        ...ulimit,
      }),
      ...ulimit,
    })),
    logConfiguration: {
      ...def.logConfiguration,
      options: Object.keys(def.logConfiguration?.options || {}).map(key => ({
        id: generateUniqueId({
          arn,
          key,
          value: def.logConfiguration?.options[key],
        }),
        key,
        value: def.logConfiguration?.options[key],
      })),
      secretOptions: def.logConfiguration?.secretOptions?.map(option => ({
        id: generateUniqueId({
          arn,
          ...option,
        }),
        ...option,
      })),
    },
    systemControls: def.systemControls?.map(control => ({
      id: generateUniqueId({
        arn,
        ...control,
      }),
      ...control,
    })),
    resourceRequirements: def.resourceRequirements?.map(rr => ({
      id: generateUniqueId({
        arn,
        ...rr,
      }),
      ...rr,
    })),
    firelensConfiguration: {
      ...def.firelensConfiguration,
      options: Object.keys(def.firelensConfiguration?.options || {}).map(
        key => ({
          id: generateUniqueId({
            arn,
            key,
            value: def.firelensConfiguration?.options[key],
          }),
          key,
          value: def.firelensConfiguration?.options[key],
        })
      ),
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
      id: generateUniqueId({
        arn,
        ...vol,
      }),
      ...vol,
      dockerVolumeConfiguration: {
        driverOpts: Object.keys(vol?.dockerVolumeConfiguration?.driverOpts).map(
          key => ({
            id: generateUniqueId({
              arn,
              key,
              value: vol?.dockerVolumeConfiguration?.driverOpts[key],
            }),
            key,
            value: vol?.dockerVolumeConfiguration?.driverOpts[key],
          })
        ),
        labels: Object.keys(vol?.dockerVolumeConfiguration?.labels).map(
          key => ({
            id: generateUniqueId({
              arn,
              key,
              value: vol?.dockerVolumeConfiguration?.labels[key],
            }),
            key,
            value: vol?.dockerVolumeConfiguration?.labels[key],
          })
        ),
      },
    })),
    status,
    requiresAttributes: requiresAttributes?.map(attr => ({
      id: generateUniqueId({
        arn,
        ...attr,
      }),
      ...attr,
    })),
    placementConstraints: placementConstraints?.map(pc => ({
      id: generateUniqueId({
        arn,
        ...pc,
      }),
      ...pc,
    })),
    compatibilities,
    requiresCompatibilities,
    cpu,
    memory,
    inferenceAccelerators: inferenceAccelerators?.map(ia => ({
      id: generateUniqueId({
        arn,
        ...ia,
      }),
      ...ia,
    })),
    pidMode,
    ipcMode,
    proxyConfiguration: {
      ...proxyConfiguration,
      properties: proxyConfiguration?.properties?.map(prop => ({
        id: generateUniqueId({
          arn,
          ...prop,
        }),
        ...prop,
      })),
    },
    registeredAt: registeredAt?.toISOString(),
    deregisteredAt: deregisteredAt?.toISOString(),
    registeredBy,
    ephemeralStorage,
  }
}
