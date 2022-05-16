const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const { ethers } = require("ethers");
const { CHILD_RPC_HTTP } = process.env;
const url = CHILD_RPC_HTTP;

const provider = new ethers.providers.JsonRpcProvider(url);

const bor = async (req, res) => {
  try {
    logger.info("-------------");
    // take request params
    const walletAddress = req.params.id;

    const balance = await provider.getBalance(walletAddress);

    logger.info(
      walletAddress,
      ethers.utils.formatUnits(balance, "ether"),
      "BONE"
    );
    const balanceInEth = ethers.utils.formatUnits(balance, "ether");
    res.status(HTTP_STATUS_CODE.OK).json(
      successResponse("Bor balance fetched", {
        address: walletAddress,
        balance: balanceInEth,
      })
    );
  } catch (error) {
    logger.error("Internal server error:", error);

    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR));
  }
};

// export module
module.exports = {
  bor,
};
