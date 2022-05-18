const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const contracts = require("../../configs/contractAddress.json");
const eth_keys = require("../../configs/eth_key.json");
const { ethers, Wallet, utils } = require("ethers");
const BoneToken = require("../../configs/contract/BoneToken.json");
const StakeManager = require("../../configs/contract/StakeManager.json");
const { getValId } = require("../../util/stake.js");
const { parseEther } = require("../../util/ether.js");
const {
  isVaidatorExists,
  JsonRpcProvider,
} = require("../../util/validator.js");

const getInfo = async (req, res) => {
  try {
    const validatorAdd = req.query.validatorAdd;
    // check requets has required parameters
    if (!validatorAdd) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    }
    // fetch provider
    const provider = await JsonRpcProvider(process.env.CHILD_RPC_HTTP);
    // fetch validator
    let validator = await isVaidatorExists(eth_keys, validatorAdd);
    // validator ot exists
    if (!validator) {
      logger.info("could not find vaidator:" + validatorAdd);
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(errorResponse(ERROR_MESSAGE.VALIDATOR_NOT_EXISTS));
    }

    // fetch wallet
    const wallet = new ethers.Wallet(validator.private_key, provider);
    //  stakeManagerContract
    const stakeManagerContract = new ethers.Contract(
      contracts.root.StakeManagerProxy,
      StakeManager.abi,
      wallet
    );
    // fetch validator ID
    const valId = await stakeManagerContract.getValidatorId(validatorAdd);
    // fetch validator info
    const validatorInfo = await stakeManagerContract.validators(
      valId.toString()
    );

    res.status(HTTP_STATUS_CODE.OK).json(
      successResponse(" Validator info fetched sucessfuly", {
        validatorInfo: validatorInfo,
      })
    );
  } catch (err) {
    console.log("Internal server error:", err);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVEvalidatorIdR_ERROR));
  }
};

// Claim Validator Reward
const claimReward = async (req, res) => {
  try {
    const validatorAccount = req.body.validatorAccount;
    // check request has required parameters
    if (!validatorAccount) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    }

    // fetch provider
    const provider = await JsonRpcProvider(process.env.ROOT_RPC_HTTP);
    // fetch validator
    let validator = await isVaidatorExists(eth_keys, validatorAccount);
    // validator ot exists
    if (!validator) {
      logger.info("could not find validator:" + validatorAccount);
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(errorResponse(ERROR_MESSAGE.VALIDATOR_NOT_EXISTS));
    }
    // fetch wallet
    const wallet = new ethers.Wallet(validator.private_key, provider);
    //  stakeManagerContract
    const stakeManagerContract = new ethers.Contract(
      contracts.root.StakeManagerProxy,
      StakeManager.abi,
      wallet
    );
    // fetch validator ID
    const valId = await stakeManagerContract.getValidatorId(validatorAccount);
    const tx = await stakeManagerContract.withdrawRewards(valId);
    await tx.wait();
    res.status(HTTP_STATUS_CODE.OK).json(
      successResponse("Reward Claimed in transaction", {
        transactionHash: tx.hash,
      })
    );
  } catch (error) {}
};

// export module
module.exports = {
  getInfo,
  claimReward,
};
