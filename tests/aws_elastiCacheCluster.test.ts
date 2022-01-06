import CloudGraph from '@cloudgraph/sdk'
import ElastiCacheCluster from '../src/services/elastiCacheCluster'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import services from '../src/enums/services'
import Subnet from '../src/services/subnet'
import Vpc from '../src/services/vpc'

// TODO: Localstack Pro Tier
describe.skip('ElastiCache Cluster Service Test: ', () => {
  let getDataResult
  let formatResult
  let clusterConnections
  let clusterId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const subnetService = new Subnet({ logger: CloudGraph.logger })
      const vpcService = new Vpc({ logger: CloudGraph.logger })
      const classInstance = new ElastiCacheCluster({
        logger: CloudGraph.logger,
      })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(data =>
        classInstance.format({ service: data, region, account })
      )

      // Get subnet data
      const subnetData = await subnetService.getData({
        credentials,
        regions: region,
      })

      // Get VPC data
      const vpcData = await vpcService.getData({
        credentials,
        regions: region,
      })

      const [cluster] = getDataResult[region]
      clusterId = cluster.ARN

      clusterConnections = classInstance.getConnections({
        service: cluster,
        data: [
          {
            name: services.subnet,
            data: subnetData,
            account,
            region,
          },
          {
            name: services.vpc,
            data: vpcData,
            account,
            region,
          },
        ],
        region,
        account,
      })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            CacheClusterId: expect.any(String),
            ClientDownloadLandingPage: expect.any(String),
            CacheNodeType: expect.any(String),
            Engine: expect.any(String),
            EngineVersion: expect.any(String),
            CacheClusterStatus: expect.any(String),
            NumCacheNodes: expect.any(Number),
            PreferredAvailabilityZone: expect.any(String),
            PreferredMaintenanceWindow: expect.any(String),
            PendingModifiedValues: expect.any(Object),
            CacheSecurityGroups: expect.any(Array),
            CacheParameterGroup: expect.any(Object),
            CacheSubnetGroupName: expect.any(String),
            AutoMinorVersionUpgrade: expect.any(Boolean),
            SecurityGroups: expect.any(Array),
            AuthTokenEnabled: expect.any(Boolean),
            TransitEncryptionEnabled: expect.any(Boolean),
            AtRestEncryptionEnabled: expect.any(Boolean),
            ARN: expect.any(String),
            ReplicationGroupLogDeliveryEnabled: expect.any(Boolean),
            LogDeliveryConfigurations: expect.any(Array),
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
            region: expect.any(String),
            cacheClusterId: expect.any(String),
            configurationEndpoint: expect.any(Object),
            clientDownloadLandingPage: expect.any(String),
            cacheNodeType: expect.any(String),
            engine: expect.any(String),
            engineVersion: expect.any(String),
            cacheClusterStatus: expect.any(String),
            numCacheNodes: expect.any(Number),
            preferredAvailabilityZone: expect.any(String),
            preferredOutpostArn: undefined,
            cacheClusterCreateTime: expect.any(String),
            preferredMaintenanceWindow: expect.any(String),
            pendingModifiedValues: expect.any(Object),
            notificationConfiguration: expect.any(Object),
            cacheSecurityGroups: expect.any(Array),
            cacheParameterGroup: expect.any(Object),
            cacheNodes: expect.any(Array),
            autoMinorVersionUpgrade: expect.any(Boolean),
            replicationGroupId: undefined,
            snapshotRetentionLimit: undefined,
            snapshotWindow: undefined,
            authTokenEnabled: expect.any(Boolean),
            authTokenLastModifiedDate: undefined,
            transitEncryptionEnabled: expect.any(Boolean),
            atRestEncryptionEnabled: expect.any(Boolean),
            replicationGroupLogDeliveryEnabled: expect.any(Boolean),
            logDeliveryConfigurations: expect.any(Array),
            tags: expect.any(Array),
            cacheSubnetGroup: expect.any(Object),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to subnet', () => {
      const subnetConnections = clusterConnections[clusterId]?.filter(
        connection => connection.resourceType === services.subnet
      )

      expect(subnetConnections).toBeDefined()
      expect(subnetConnections.length).toBe(1)
    })

    test('should verify the connection to vpc', () => {
      const vpcConnections = clusterConnections[clusterId]?.filter(
        connection => connection.resourceType === services.vpc
      )

      expect(vpcConnections).toBeDefined()
      expect(vpcConnections.length).toBe(1)
    })
  })
})
