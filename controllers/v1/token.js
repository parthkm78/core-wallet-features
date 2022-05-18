require("dotenv").config();
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const { ethers } = require("ethers");
const ChildERC20 = require("../../configs/contract/ChildERC20.json");

const provider = new ethers.providers.JsonRpcProvider(
  process.env.CHILD_RPC_HTTP
);

const getInfo = async (req, res) => {
  try {
    const tokenAddress = req.params.tokenAddress;

    logger.info(`Token Address ${tokenAddress}`);
    const childERC20Contract = new ethers.Contract(
      tokenAddress,
      ChildERC20.abi,
      provider
    );

    const childChain = await childERC20Contract.childChain();
    const owner = await childERC20Contract.owner();
    logger.info(`childChain, ${childChain}`);
    logger.info(`owner, ${owner}`);
    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse("Token Info Fetched", {
        childChain: childChain,
        owner: owner,
      })
    );
  } catch (error) {
    logger.error(`Internal server error: , ${error}`);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER));
  }
};

// export module
module.exports = {
  getInfo,
};
