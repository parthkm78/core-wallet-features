const HDWalletProvider = require("@truffle/hdwallet-provider");
// const Network = require('../config/network')
const MaticPlasmaClient = require("../vendor/matic.node").default;
const { MaticPOSClient } = require("../vendor/matic.node");
const config = require("../util/networkConfig.js");

const { MNEMONIC } = process.env;

const parentProvider = new HDWalletProvider(
  MNEMONIC,
  config.network.parent.rpc
);
const maticProvider = new HDWalletProvider(MNEMONIC, config.network.child.rpc);

async function getMaticPlasmaClient(network = "testnet", version = "alpha") {
  const client = new MaticPlasmaClient({
    network: network,
    version: version,
    parentProvider,
    maticProvider,
    parentDefaultOptions: { from: parentProvider.getAddress(0) },
    maticDefaultOptions: { from: maticProvider.getAddress(0) },
  });

  // await client.initialize();

  // return client;

  try {
    await client.initialize();
    return client;
  } catch (error) {
    console.log(error);
  }
}

const getMaticPOSClient = () => {
  return new MaticPOSClient({
    network: "testnet", // For mainnet change this to mainnet
    version: "alpha", // For mainnet change this to v1
    parentProvider,
    maticProvider,
    parentDefaultOptions: { from: parentProvider.getAddress(0) },
    maticDefaultOptions: { from: maticProvider.getAddress(0) },
  });
};

const getClient = async (clientType) => {
  if (clientType === "pos") {
    return getMaticPOSClient();
  } else {
    // return await getMaticPlasmaClient();

    try {
      return await getMaticPlasmaClient();
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  getMaticPlasmaClient,
  getMaticPOSClient,
  getClient,
};
