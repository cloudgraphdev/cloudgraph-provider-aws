import { Tag } from 'aws-sdk/clients/ec2'
import { isEmpty, last } from 'lodash'

const clusterTag = 'kubernetes.io/cluster/'
const environmentIdTag = 'elasticbeanstalk:environment-id'

export const getEksClusterName = (tags?: Tag[]): string => {
  if (isEmpty(tags)) {
    return ''
  }
  let eksClusterName = ''
  Object.keys(tags)?.some(key => {
    const isMatch = key.includes(clusterTag)
    if (isMatch) {
      eksClusterName = last(key.split('/'))
    }
    return isMatch
  })
  return eksClusterName
}

export const getElasticBeanstalkEnvId = (tags?: Tag[]): string => {
  if (isEmpty(tags)) {
    return ''
  }
  let elasticBeanstalkId = ''
  Object.keys(tags)?.some(key => {
    const isMatch = key.includes(environmentIdTag)
    if (isMatch) {
      elasticBeanstalkId = tags[key]
    }
    return isMatch
  })
  return elasticBeanstalkId
}
