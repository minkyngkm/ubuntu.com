const TCO_CONSTANTS = {
  ratios: {
    desiredCloudUtilisationRatio: 75,
    cpuOvercommitmentRatio: 2,
    ramOvercommitmentRatio: 1,
    persistentStorageReplicationFactor: 3,
  },
  counts: {
    numberOfThreadsPerCpu: 128,
    reservedNumberOfThreadsPerNode: 12,
    numberOfCpusPerNode: 2,
    minimumNumberOfCloudNodes: 9,
    maximumNumberOfCloudNodesInRack: 7,
    minimumNumberOfRacks: 3,
    numberOfRackControllerNodesInRack: 0,
    numberOfInfraNodes: 3,
    numberOfRacksPerSpineSwitch: 2,
    numberOfLeafSwitchesInRack: 1,
    numberOfRacksPerManagementSwitch: 2,
  },
  storage: {
    amountOfRamPerNode: 2048,
    reservedAmountOfRamPerNode: 224,
    amountOfEphemeralStoragePerNode: 6.4,
    reservedAmountOfEphemeralStoragePerNode: 50,
    amountOfPersistentStoragePerNode: 72,
    awsEc2InstanceVcpus: 2,
    awsEc2InstanceRam: 8,
    awsEc2InstanceEphemeralStorage: 8,
    awsEc2InstancePersistentStorage: 0,
  },
  price: {
    pricePerCloudNode: 36500,
    pricePerInfraNode: 8000,
    pricePerRackController: 500,
    pricePerSpineSwitch: 40000,
    pricePerLeafSwitch: 40000,
    pricePerManagementSwitch: 5000,
    annualPerNodeHardwareInstallationAndMaintenanceCost: 1000,
    annualPerNodeHostingRentAndElectricityCost: 4500,
    annualPerGbpsHostingExternalNetworkCost: 6000,
    operationsTeamAvarageAnnualStaffSalary: 125000,
    deliveryCost: 75000,
    annualLicenseCost: 0,
    awsEc2T3aLargeHourlyInstanceCost: 0.0752,
  },
  operations: {
    externalNetworkBandwidth: 1,
    supported: 1500,
    fullyManaged: 5475,
    operationsTeamSize: 12,
    hardWareRenewalPeriod: 3,
  },
};

export default TCO_CONSTANTS;
