require("dotenv").config();
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const logger = require("../../util/logger.js");
const validator = require("express-validator");
const { validationResult } = validator;
const { ethers } = require("ethers");
const ChildERC20 = require("../../configs/contract/ChildERC20.json");
const { getClient } = require("../../client/index.js");
const config = require("../../util/networkConfig.js");
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

const getPlasma = async (req, res) => {
  const client = await getClient("plasma");

  const parentWeb3 = client.web3Client.getParentWeb3();
  const abi = [
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  console.log("");
  let tokens = new Array();

  for (const [key, value] of Object.entries(config.tokens.plasma)) {
    try {
      const contract = new parentWeb3.eth.Contract(abi, value.parent);
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();

      console.log(`key    : ${key}`);
      console.log(`name   : ${name}`);
      console.log(`symbol : ${symbol}`);
      console.log(`type   : ${value.type}`);
      console.log(`${value.parent} => ${value.child}`);
      console.log("------");
      const token = {
        key: key,
        name: name,
        symbol: symbol,
        type: value.type,
        parentContract: value.parent,
        childContract: value.child,
      };
      tokens.push(token);
    } catch (e) {
      console.log(e);
    }
  }
  res
    .status(HTTP_STATUS_CODE.OK)
    .json(successResponse("plasma token list fetched", { tokens }));
};

const getPos = async (req, res) => {
  const client = await getClient("pos");
  const parentWeb3 = client.web3Client.getParentWeb3();
  const abi = [
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  console.log("");
  let tokens = new Array();

  for (const [key, value] of Object.entries(config.tokens.pos)) {
    try {
      let name;
      let symbol;
      if (key === "weth") {
        name = "Wrapped Ether";
        symbol = "WETH";
      } else if (value.type === "erc1155") {
        name = key;
        symbol = "";
      } else {
        const contract = new parentWeb3.eth.Contract(abi, value.parent);
        name = await contract.methods.name().call();
        symbol = await contract.methods.symbol().call();
      }
      console.log(`key    : ${key}`);
      console.log(`name   : ${name}`);
      console.log(`symbol : ${symbol}`);
      console.log(`type   : ${value.type}`);
      console.log(`${value.parent} => ${value.child}`);
      console.log("------");
      const token = {
        key: key,
        name: name,
        symbol: symbol,
        type: value.type,
        parentContract: value.parent,
        childContract: value.child,
      };
      tokens.push(token);
    } catch (e) {
      console.log(e);
    }
  }
  res
    .status(HTTP_STATUS_CODE.OK)
    .json(successResponse("pos token list fetched", { tokens }));
};

// export module
module.exports = {
  getInfo,
  getPlasma,
  getPos,
};
