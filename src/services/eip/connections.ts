import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'
import { Address } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsEip } from './data'

/**
 * EIP
 */

export default ({
  service: eip,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsEip
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { AllocationId: id, NetworkInterfaceId: networkInterfaceId } = eip

  /**
   * Find Network Interfaces
   * related to this EIP
   */
  const networkInterfaces: {
    name: string
    data: { [property: string]: (Address & { region: string })[] }
  } = data.find(({ name }) => name === services.networkInterface)

  if (networkInterfaces?.data?.[region]) {
    const networkInterfacesInRegion: (Address & { region: string })[] =
      networkInterfaces.data[region].filter(
        ({ NetworkInterfaceId }: Address & { region: string }) =>
          NetworkInterfaceId === networkInterfaceId
      )

    if (!isEmpty(networkInterfacesInRegion)) {
      for (const networkInterface of networkInterfacesInRegion) {
        connections.push({
          id: networkInterface.NetworkInterfaceId,
          resourceType: services.networkInterface,
          relation: 'child',
          field: 'networkInterface',
        })
      }
    }
  }

  const eipResult = {
    [id]: connections,
  }
  return eipResult
}
