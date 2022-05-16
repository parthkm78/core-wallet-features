const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;

require("dotenv").config();
const { ethers } = require("ethers");
const ChildERC20 = require("../../configs/contract/ChildERC20.json");

const { CHILD_RPC_HTTP } = process.env;

const provider = new ethers.providers.JsonRpcProvider(CHILD_RPC_HTTP);

const getInfo = async (req, res) => {
  //   const token = req.query.tokenAddress;
  try {
    const token = req.params.id;

    logger.info(`Token Address ${token}`);
    const childERC20Contract = new ethers.Contract(
      token,
      ChildERC20.abi,
      provider
    );

    const childChain = await childERC20Contract.childChain();
    const owner = await childERC20Contract.owner();
    console.log("childChain", childChain);
    console.log("owner", owner);
    return res.status(HTTP_STATUS_CODE.OK).json(
      successResponse("Token Info Fetched", {
        childChain: childChain,
        owner: owner,
      })
    );
  } catch (error) {
    console.log("Internal server error:", err);
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER));
  }
};

// export module
module.exports = {
  getInfo,
};
