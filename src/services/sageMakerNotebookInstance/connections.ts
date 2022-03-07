import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import services from '../../enums/services'
import { AwsKms } from '../kms/data'
import { RawAwsSageMakerNotebookInstance } from '../sageMakerNotebookInstance/data'
import { AwsSecurityGroup } from '../securityGroup/data'

export default ({
  service: notebook,
  data,
  region,
}: {
  service: RawAwsSageMakerNotebookInstance
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { SecurityGroups = [], KmsKeyId, NotebookInstanceArn } = notebook
  const connections: ServiceConnection[] = []
  /**
   * Find related securityGroups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.sg)
  if (securityGroups?.data?.[region]) {
    const dataInRegion: AwsSecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) => SecurityGroups.includes(GroupId)
    )
    if (!isEmpty(dataInRegion)) {
      for (const sg of dataInRegion) {
        const { GroupId: id } = sg
        connections.push({
          id,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  /**
   * Find any kms related data
   */
  const keys = data.find(({ name }) => name === services.kms)
  if (keys?.data?.[region]) {
    const dataAtRegion: AwsKms[] = keys.data[region].filter(
      ({ KeyArn }: AwsKms) => KeyArn === KmsKeyId
    )
    for (const key of dataAtRegion) {
      connections.push({
        id: key.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  const natResult = {
    [NotebookInstanceArn]: connections,
  }
  return natResult
}
