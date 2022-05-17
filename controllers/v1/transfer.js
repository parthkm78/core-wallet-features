const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const  logger  = require("../../util/logger.js");
const { ethers } = require('ethers');
const { parseEther } = require("../../util/ether.js");
const { JsonRpcProvider } = require("../../util/validator.js");
const Web3 = require( "web3" )

const { getClient } = require( "../../client/index.js" )

const config = require("../../util/networkConfig.js");


const sendL2Asset = async (req, res) => {
  try {
    
    let clientType = req.params.clientType;
    let token = req.body.token;
    let from =  req.body.from;
    let to =  req.body.to;
    let amount =  req.body.amount;

    if(!clientType || !token || !from || !to || !amount)
    {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    }
  
    const childAddr = await Web3.utils.toChecksumAddress( config.tokens[clientType][token].child );
    const format = config.tokens[clientType][token].format;
    const type = config.tokens[clientType][token].type;

    const amountWei = await Web3.utils.toWei( String( amount ), format );
    console.log("amount wei : ", amountWei)

    if(type !== 'erc20') {
      logger.info('not implemented yet')
    }

    const client = await getClient( clientType )

    logger.info(`transferring ${amount} ${token} from ${from} to ${to}`)

    let tx;

    if(token === 'bone' && clientType === 'plasma') {
      tx = await client.transferMaticEth(to, amountWei, {from : from, value : false })// parent: true, // For token transfer on Main network (false for Matic Network)
    } else {
      tx = await client.transferERC20Tokens(childAddr, to, amountWei, {from : from, value : false})  // parent: true, // For token transfer on Main network (false for Matic Network)
    }

    logger.info(`Transfer Tx: ${tx.transactionHash}`)
    res.status(HTTP_STATUS_CODE.OK)
    .json(successResponse("Token / coin send sucessfuly", { transectionHash : tx.transactionHash}));
  } 
  catch (err) {
   logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, 
        { transectionDetail : { transectionHash :  err?.transactionHash,
                                reason :  err?.reason,
                                code :  err?.code}} ));
  };
};


const sendETH = async (req, res) => {
  let transection;
  try {
    const toAddress = req.body.toAddress;
    const privateKey = req.body.privateKey;
    const amount = req.body.amount;
    // check requets has required parameters
    if(!toAddress ||  !privateKey || ( !amount || amount <= 0))
    {
       return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    };

    // fetch provider
    const provider = await JsonRpcProvider(process.env.ROOT_RPC_HTTP);
    
    // fetch wallet
    const wallet = await new ethers.Wallet(privateKey, provider)
    //  stakeManagerContract    
    
    const walletSigner = await wallet.connect(provider)

    // fetch sender balance
    const valBalance = await walletSigner.getBalance()
    logger.info("from bal:", ethers.utils.formatUnits(valBalance, "ether"))

    const tobal = await provider.getBalance(toAddress)
    logger.info("to bal:", ethers.utils.formatUnits(tobal, "ether"))

    if(await ethers.utils.formatUnits(valBalance, "ether") <= amount )
    {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.INSUFFICIENT_BALANCE));
    }

    logger.info(`sending ${amount} from ${wallet.address} to ${toAddress}`)

    const gasPrice = await provider.getGasPrice()
    const nonce = await provider.getTransactionCount(walletSigner.address, "latest");

  const tx = {
    to: toAddress,
    value: await ethers.utils.parseEther(amount),
    nonce: nonce,
    gasLimit: "0x100000", // 100000
    gasPrice: gasPrice,
  }

  transection = await walletSigner.sendTransaction(tx);
  // The operation is NOT complete yet; wait for it to mine. *** This will be removed ***
  await transection.wait()

  res.status(HTTP_STATUS_CODE.OK)
      .json(successResponse("ETH send sucessfuly", { transectionHash : transection.hash}));
  }
  catch (err) {
   logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, 
        { transectionDetail : { transectionHash :  err?.transactionHash,
                                reason :  err?.reason,
                                code :  err?.code}} ));
  };
};

const sendBone = async (req, res) => {
  let transection;
  try {
    const toAddress = req.body.toAddress;
    // ** This will be removed *******
    const privateKey = req.body.privateKey;
    const amount = req.body.amount;
    // check requets has required parameters
    if(!toAddress ||  !privateKey || ( !amount || amount <= 0))
    {
       return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING));
    };

    // fetch provider
    const provider = await JsonRpcProvider(process.env.CHILD_RPC_HTTP);
    
    // fetch wallet
    const wallet = await new ethers.Wallet(privateKey, provider)
    //  stakeManagerContract    
    
    const walletSigner = await wallet.connect(provider)

    // fetch sender balance
    const valBalance = await walletSigner.getBalance()
    logger.info("from bal"+ await ethers.utils.formatUnits(valBalance, "ether"))

    const tobal = await provider.getBalance(toAddress)
    logger.info("to bal" +  await ethers.utils.formatUnits(tobal, "ether"))

    if(await ethers.utils.formatUnits(valBalance, "ether") <= amount )
    {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(errorResponse(ERROR_MESSAGE.INSUFFICIENT_BALANCE));0/transfer/eth
    }
    logger.info(`sending ${amount} from ${wallet.address} to ${toAddress}`)

    const gasPrice = await provider.getGasPrice()
    const nonce = await provider.getTransactionCount(walletSigner.address, "latest");

  const tx = {
    to: toAddress,
    value: await ethers.utils.parseEther(amount),
    nonce: nonce,
    gasLimit: "0x100000", // 100000
    gasPrice: gasPrice,
  }

  transection = await walletSigner.sendTransaction(tx);
  // The operation is NOT complete yet; wait for it to mine. *** This will be removed ***
  await transection.wait()

  res.status(HTTP_STATUS_CODE.OK)
      .json(successResponse("BONE send sucessfuly", { transectionHash : transection.hash}));
  }
  catch (err) {
   logger.error("Internal server error:", err);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, 
        { transectionDetail : { transectionHash :  err?.transactionHash,
                                reason :  err?.reason,
                                code :  err?.code}} ));
  };
};

// export module
module.exports = {
  sendETH,
  sendBone,
  sendL2Asset
};
