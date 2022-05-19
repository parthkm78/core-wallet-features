const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const config = require("../../config/index.js");
const { getClient } = require("../../client/index.js");
const { MNEMONIC } = process.env;

const getAccounts = async (req, res) => {
  try {
    console.log(
      "Wallet addresses available and their ETH balances on the Parent network"
    );
    const provider = new HDWalletProvider(MNEMONIC, config.network.parent.rpc);
    const client = await getClient("pos");
    let accounts = new Array();
    for (let i = 0; i < 10; i += 1) {
      const addr = provider.getAddress(i);
      const balance = await client.web3Client
        .getParentWeb3()
        .eth.getBalance(addr);
      console.log(`${i}  : ${addr} ${Web3.utils.fromWei(balance)} ETH`);
      const account = {
        address: addr,
        balance: Web3.utils.fromWei(balance),
      };
      accounts.push(account);
    }
    res
      .status(HTTP_STATUS_CODE.OK)
      .json(successResponse("Account list fetched", { accounts }));
  } catch (error) {
    logger.error("Internal server error:", error);

    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getAccounts,
};
