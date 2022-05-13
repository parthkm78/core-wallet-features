const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const  logger  = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const contracts = require("../../configs/contractAddress.json")
const eth_keys = require("../../configs/eth_key.json")
const { ethers,  Wallet, utils } = require('ethers')
const BoneToken = require("../../configs/contract/BoneToken.json")
const StakeManager = require("../../configs/contract/StakeManager.json")
const { getValId } = require("../../util/stake.js");
const { parseEther } = require("../../util/ether.js");
const { isVaidatorExists, JsonRpcProvider } = require("../../util/validator.js");

const { ROOT_RPC_HTTP } = process.env

const url = ROOT_RPC_HTTP;

const provider = new ethers.providers.JsonRpcProvider(url)

const reStake = async (req, res) => {
  
  let tx = null;

  try {
    const validatorAdd = req.body.validatorAdd;
    const amount = req.body.amount;
    const reward = req.body.reward;
     // check requets has required parameters
    if(!validatorAdd || !reward || !reward)
    {
       return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    };

    // configure stake, dee & approvall amount
    const stakeAmount = await parseEther(amount)
    const stakeRewards = await parseEther(reward)
    const approveAmount = await parseEther('1000000')
  
    logger.info("stakeAmount:" + stakeAmount)
    let validator = await isVaidatorExists(eth_keys, validatorAdd);
 
    // if key not exists from bootsrap valset & test accounts
    if(!validator) {
     logger.info("could not find key:" + validatorAdd);
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json(errorResponse(ERROR_MESSAGE.VALIDATOR_NOT_EXISTS));
    }
  
    // fetch provider
    const provider = await JsonRpcProvider(process.env.ROOT_RPC_HTTP);
    // fetch wallet
    const wallet = new ethers.Wallet(validator.private_key, provider)
  
    // load the StakeManager abi for the StakeManagerProxy address!
    const stakeManagerContract = new ethers.Contract(contracts.root.StakeManagerProxy, StakeManager.abi, wallet)
   // console.log("connn:", stakeManagerContract)
    const boneContract = new ethers.Contract(contracts.root.tokens.BoneToken, BoneToken.abi, wallet)
  
    // Approve stakeManager to spend BONE for validator
    tx = await boneContract.approve(contracts.root.StakeManagerProxy, approveAmount)
    logger.info("wait for tx", tx.hash, "to be mined");
    // The operation is NOT complete yet; wait for it to mine. *** This will be removed ***
    await tx.wait()
  
    logger.info('sent approve tx, staking now...')
    // call restake function of smart contract
    const valId = await stakeManagerContract.getValidatorId(validatorAdd);
     tx = await stakeManagerContract.restake(valId, stakeAmount, stakeRewards);

    res.status(HTTP_STATUS_CODE.OK)
      .json(successResponse(" Transection has been sent", { transectionHash : tx?.hash }));
  }
  catch (err) {
   console.log("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVEvalidatorIdR_ERROR, { transectionHash : tx.hash }));
  };
};


const stake = async (req, res) => {
  
  let tx;
  try {
  
   logger.info("-------------")
    // take request params
    const validatorAdd = req.body.validatorAdd;
    const amount = req.body.amount;
    const fee = req.body.fee;

    // configure stake, dee & approvall amount
    const stakeAmount = ethers.utils.parseEther(amount)
    const feeAmount = ethers.utils.parseEther(fee)
    const approveAmount = ethers.utils.parseEther('1000000')
  
    let v = null
   logger.info("-------------")
    // fetch validator key
    for(let i = 0; i < eth_keys.validators.length; i += 1) {
      if(eth_keys.validators[i].address === validatorAdd) {
        v = eth_keys.validators[i]
      }
    }
  
    // if key not exists then find from test accounts
    if(!v && eth_keys.tests) {
     logger.info("could not find key", validatorAdd, "in bootstrap valset - checking test accounts")
      for(let i = 0; i < eth_keys.tests.length; i += 1) {
        if(eth_keys.tests[i].address === validatorAdd) {
          v = eth_keys.tests[i]
        }taht
      }
    }
  
    // if key not exists from bbotsrao valset & test accounts
    if(!v) {
     logger.info("could not find key", validatorAdd);
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json(errorResponse(ERROR_MESSAGE.VALIDATOR_NOT_EXISTS));
    }
  
   logger.info(v.address, "staking", amount, "with heimdall fee", fee, "signer_public_key", v.signer_public_key)
  
    // fetch wallet
    const wallet = new ethers.Wallet(v.private_key, provider)
  
    // load the StakeManager abi for the StakeManagerProxy address!
    const stakeManagerContract = new ethers.Contract(contracts.root.StakeManagerProxy, StakeManager.abi, wallet)
    const boneContract = new ethers.Contract(contracts.root.tokens.BoneToken, BoneToken.abi, wallet)
  
   logger.info({ stakeManager: contracts.root.StakeManagerProxy, boneToken: contracts.root.tokens.BoneToken, stakeToken: await stakeManagerContract.token() })
   logger.info("Sender account has a BONE balanceOf", utils.formatUnits((await boneContract.balanceOf(wallet.address)), "ether"))
  
   logger.info("approve stakeManager to spend BONE for validator")
    tx = await boneContract.approve(contracts.root.StakeManagerProxy, approveAmount)
   logger.info("wait for tx", tx.hash, "to be mined")
    // The operation is NOT complete yet; we must wait until it is mined
    await tx.wait()
  
   logger.info('sent approve tx, staking now...')
    // Remember to change the 4th parameter to false if delegation is not required
    // also using signer_public_key, which has the 0x04 prefix removed (so just 0x...)
    tx = await stakeManagerContract.stakeFor(v.address, stakeAmount, feeAmount, true, v.signer_public_key)
   logger.info("wait for tx", tx.hash, "to be mined")
  res.status(HTTP_STATUS_CODE.OK)
  .json(successResponse(" Transection  hash is created", { transectionHash : tx.hash }));
  }
  catch (err) {
   logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, { transectionHash : tx.hash }));
  };
};

module.exports = {
  stake,
  reStake
};
