import { AWSError } from 'aws-sdk'

import { promisify } from 'util'

import get from 'lodash/get'
import head from 'lodash/head'

// import { GetterData } from '../types'

export function convertToPromise<ParamsType, DataType>({
  sdkContext,
  fnName,
}: {
  sdkContext: any
  fnName: keyof any
}): any {
  return promisify(
    (params: ParamsType, cb: (err: AWSError, data: DataType) => void) => {
      sdkContext[fnName](params, (err, data: DataType) => cb(err, data))
    }
  )
}

export async function fetchAllPaginatedData<GReturnType, GInitialParamsType>({
  accessor,
  initialParams,
  getResourcesFn,
  returnFirst = false,
}: {
  initialParams?: GInitialParamsType
  getResourcesFn: Function
  returnFirst?: boolean
  accessor: string
}): Promise<any> {
  function getValidResource(payloadData): Array<GReturnType> {
    const { ResponseMetadata, ...usefulResourceData } = payloadData
    const key = Object.keys(usefulResourceData).find(
      prop => typeof usefulResourceData[prop] !== 'undefined'
    )
    return usefulResourceData[key]
  }

  let resourcesList: Array<GReturnType> = []

  const params = initialParams || {}

  const { Marker, ...relevantPayloadData } = await getResourcesFn(params)
  let resources = getValidResource(relevantPayloadData)

  resourcesList = resourcesList.concat(...(resources as Array<GReturnType>))

  let markerController = Marker

  while (markerController) {
    const { Marker, ...relevantPayloadData } = await getResourcesFn({
      ...params,
      Marker: markerController,
    })

    resources = getValidResource(relevantPayloadData)
    resourcesList = resourcesList.concat(...(resources as Array<GReturnType>))
    markerController = Marker
  }

  const result = accessor
    ? resourcesList.flatMap(r => get(r, accessor))
    : resourcesList

  return returnFirst ? head(result) : result
}
