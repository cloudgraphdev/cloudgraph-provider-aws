import CloudGraph from '@cloudgraph/sdk'
import RDSDbInstance from '../src/services/rdsDbInstance'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import services from '../src/enums/services'
import Subnet from '../src/services/subnet'
import SecurityGroup from '../src/services/securityGroup'
import KMS from '../src/services/kms'

// TODO: Localstack Pro Tier
describe.skip('RDS DB Instance Service Test: ', () => {
  let getDataResult
  let formatResult
  let rdsDbInstanceConnections
  let rdsDbInstanceId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const subnetService = new Subnet({ logger: CloudGraph.logger })
      const sgService = new SecurityGroup({ logger: CloudGraph.logger })
      const kmsService = new KMS({ logger: CloudGraph.logger })
      const classInstance = new RDSDbInstance({
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

      // Get security group data
      const sgData = await sgService.getData({
        credentials,
        regions: region,
      })

      // Get kms data
      const kmsData = await kmsService.getData({
        credentials,
        regions: region,
      })

      const [cluster] = getDataResult[region]
      rdsDbInstanceId = cluster.DBInstanceArn

      rdsDbInstanceConnections = classInstance.getConnections({
        service: cluster,
        data: [
          {
            name: services.subnet,
            data: subnetData,
            account,
            region,
          },
          {
            name: services.sg,
            data: sgData,
            account,
            region,
          },
          {
            name: services.kms,
            data: kmsData,
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
            ActivityStreamStatus: expect.any(String),
            AllocatedStorage: expect.any(Number),
            AssociatedRoles: expect.any(Array),
            AutoMinorVersionUpgrade: expect.any(Boolean),
            AvailabilityZone: expect.any(String),
            BackupRetentionPeriod: expect.any(Number),
            CACertificateIdentifier: expect.any(String),
            CopyTagsToSnapshot: expect.any(Boolean),
            CustomerOwnedIpEnabled: expect.any(Boolean),
            DBInstanceArn: expect.any(String),
            DBInstanceAutomatedBackupsReplications: expect.any(Array),
            DBInstanceClass: expect.any(String),
            DBInstanceIdentifier: expect.any(String),
            DBInstanceStatus: expect.any(String),
            DBParameterGroups: expect.any(Array),
            DBSecurityGroups: expect.any(Array),
            DBSubnetGroup: expect.any(Object),
            DbInstancePort: expect.any(Number),
            DbiResourceId: expect.any(String),
            DeletionProtection: expect.any(Boolean),
            DomainMemberships: expect.any(Array),
            EnabledCloudwatchLogsExports: expect.any(Array),
            Endpoint: expect.any(Object),
            Engine: expect.any(String),
            EngineVersion: expect.any(String),
            IAMDatabaseAuthenticationEnabled: expect.any(Boolean),
            InstanceCreateTime: expect.any(Date),
            LatestRestorableTime: expect.any(Date),
            LicenseModel: expect.any(String),
            MasterUsername: expect.any(String),
            MaxAllocatedStorage: expect.any(Number),
            MonitoringInterval: expect.any(Number),
            MultiAZ: expect.any(Boolean),
            OptionGroupMemberships: expect.any(Array),
            PendingModifiedValues: expect.any(Object),
            PerformanceInsightsEnabled: expect.any(Boolean),
            PreferredBackupWindow: expect.any(String),
            PreferredMaintenanceWindow: expect.any(String),
            ProcessorFeatures: expect.any(Array),
            PubliclyAccessible: expect.any(Boolean),
            ReadReplicaDBClusterIdentifiers: expect.any(Array),
            ReadReplicaDBInstanceIdentifiers: expect.any(Array),
            StatusInfos: expect.any(Array),
            StorageEncrypted: expect.any(Boolean),
            StorageType: expect.any(String),
            TagList: expect.any(Array),
            Tags: expect.any(Object),
            VpcSecurityGroups: expect.any(Array),
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
            region: expect.any(String),
            dBInstanceIdentifier: expect.any(String),
            instanceClass: expect.any(String),
            engine: expect.any(String),
            status: expect.any(String),
            username: expect.any(String),
            allocatedStorage: expect.any(Number),
            availabilityZone: expect.any(String),
            multiAZ: expect.any(Boolean),
            engineVersion: expect.any(String),
            autoMinorVersionUpgrade: expect.any(Boolean),
            publiclyAccessible: expect.any(Boolean),
            storageType: expect.any(String),
            kmsKey: undefined,
            failoverPriority: undefined,
            encrypted: expect.any(Boolean),
            resourceId: expect.any(String),
            certificateAuthority: expect.any(String),
            copyTagsToSnapshot: expect.any(Boolean),
            iamDbAuthenticationEnabled: expect.any(Boolean),
            performanceInsightsEnabled: expect.any(Boolean),
            deletionProtection: expect.any(Boolean),
            tags: expect.any(Array),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to subnet', () => {
      const subnetConnections = rdsDbInstanceConnections[
        rdsDbInstanceId
      ]?.filter(connection => connection.resourceType === services.subnet)

      expect(subnetConnections).toBeDefined()
      expect(subnetConnections.length).toBe(6)
    })

    test('should verify the connection to security groups', () => {
      const sgConnections = rdsDbInstanceConnections[rdsDbInstanceId]?.filter(
        connection => connection.resourceType === services.sg
      )

      expect(sgConnections).toBeDefined()
      expect(sgConnections.length).toBe(1)
    })

    test('should verify the connection to kms', () => {
      const kmsConnections = rdsDbInstanceConnections[rdsDbInstanceId]?.filter(
        connection => connection.resourceType === services.kms
      )

      expect(kmsConnections).toBeDefined()
      expect(kmsConnections.length).toBe(1)
    })
  })
})
