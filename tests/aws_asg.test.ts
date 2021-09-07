import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import EC2Service from '../src/services/ec2'
import AsgClass from '../src/services/asg'
import { RawAwsAsg } from '../src/services/asg/data'
import { initTestConfig } from "../src/utils"
import { credentials, region } from '../src/properties/test'
import services from '../src/enums/services'

describe('ASG Service Test: ', () => {
  let getDataResult
  let formatResult
  let asgConnections
  let asgId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const asgClass = new AsgClass({ logger: CloudGraph.logger })
          const ec2Class = new EC2Service({ logger: CloudGraph.logger })

          getDataResult = await asgClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: RawAwsAsg) =>
            asgClass.format({ service: item, region })
          )
          // Get EC2 Instance data
          const ec2InstanceData = await ec2Class.getData({
            credentials,
            regions: region,
          })

          const [asg] = getDataResult[region]
          asgId = asg.AutoScalingGroupARN

          asgConnections = asgClass.getConnections({
            service: asg,
            data: [
              {
                name: services.ec2Instance,
                data: ec2InstanceData,
                region,
              }
            ],
            region,
          })
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            AutoScalingGroupARN: expect.any(String),
            AutoScalingGroupName: expect.any(String),
            MinSize: expect.any(Number),
            MaxSize: expect.any(Number),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            name: expect.any(String),
            region: expect.any(String),
            minSize: expect.any(Number),
            maxSize: expect.any(Number),
          })
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to ec2 instance', async () => {
      const ec2InstanceConnections = asgConnections[asgId].filter(
        connection => connection.resourceType === services.ec2Instance
      )

      expect(ec2InstanceConnections).toBeDefined()
      expect(ec2InstanceConnections.length).toBe(1)
    })
  })
})
