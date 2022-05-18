const Web3 = require( "web3" )
const { getClient } = require( "../../client/index.js" )
const config = require("../../util/networkConfig.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");
const  logger  = require("../../util/logger.js");

const plasmaBurn = async (client, type, tokenAddress, from, amount) => {
  let tx
  switch(type) {
    case 'erc20':
      tx =  await client.startWithdraw(tokenAddress, amount, {
        from,
      })
      break
    default:
      console.log("not implemented yet")
      process.exit(1)
      break
  }
  return tx
}

const posBurn = async (client, type, tokenAddress, from, amount) => {
  let tx
  switch(type) {
    case 'erc20':
      tx =  await client.burnERC20(tokenAddress, amount, {
        from
      })
      break
    default:
      console.log("not implemented yet")
      process.exit(1)
      break
  }
  return tx
}

const startBurn = async (req, res) => {


  try {
    let clientType = req.params.clientType;
    let token = req.body.token;
    let from =  await Web3.utils.toChecksumAddress(req.body.from);
    let amount =  req.body.amount;

    console.log("token:"+ token)
    console.log(`begin ${token} exit from L2 -> L1 using ${clientType}`)
    const childAddr = Web3.utils.toChecksumAddress( config.tokens[clientType][token].child )
    const format = config.tokens[clientType][token].format
    const type = config.tokens[clientType][token].type

    const amountWei = Web3.utils.toWei( String( amount ), format )

    const client = await getClient(clientType)

    let tx
    console.log('sending burn/burn tx')
    if(clientType === 'plasma') {
      tx = await plasmaBurn(client, type, childAddr, from, amountWei)
    } else {
      tx = await posBurn(client, type, childAddr, from, amountWei)
    }

    console.log(`Burn/Exit Tx: ${ tx.transactionHash}`)
    console.log('Use the Tx to track the burn/burn and check checkpoint incusion on Parent chain:')
    console.log(`   sandbox-wallet exit burn ${clientType} status ${ tx.transactionHash}`)
    console.log('Use the Tx to finalise and withdraw when ready:')
    console.log(`   sandbox-wallet exit withdraw ${clientType} ${ tx.transactionHash}`)

  } catch(err) {
    logger.error("Internal server error:", err);
     return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
       .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, 
         { transectionDetail : { transectionHash :  err?.transactionHash,
                                 reason :  err?.reason,
                                 code :  err?.code}} ));
  }
}

const burnStatus = async (req, res) => {
  try {
    
    let clientType = req.params.clientType;
    let txHash = req.params.tx;
    const client = await getClient( clientType )

    const tokenList = config.tokens[clientType]
    console.log("--1--")

    const burnExitTx = await client.web3Client.getMaticWeb3().eth.getTransaction(txHash)
    console.log("--2--")
    const burnExitTxReceipt = await client.web3Client.getMaticWeb3().eth.getTransactionReceipt(txHash)
    console.log("--2--")
    const from = String(burnExitTx.from)

    const tokenAddress = Web3.utils.toChecksumAddress(burnExitTxReceipt.to)

    console.log(`Exit type        : ${clientType}`)
    console.log(`Tx was sent from : ${from}`)
    for (const [key, value] of Object.entries(tokenList)) {
      if(tokenAddress === Web3.utils.toChecksumAddress(value.child)) {
        console.log(`Token            : ${key}`)
        console.log(`Root Address     : ${value.parent}`)
        console.log(`Child Address    : ${value.child}`)
        break
      }
    }

    const inclusion = await client.rootChain.getCheckpointInclusion( txHash )
    if(inclusion === 'Burn transaction has not been checkpointed as yet') {
      console.log(inclusion)
    }

    const d = new Date(parseInt(inclusion.createdAt, 10) * 1000)

    console.log('')
    console.log(`checkpoint included at ${d}`)
    console.log('')
    console.log('withdraw process can be executed with:')
    console.log(`  sandbox-wallet exit withdraw ${clientType} ${txHash}`)
    console.log('')

    res.status(HTTP_STATUS_CODE.OK)
      .json(successResponse("Detail fetched sucessfully", { inclusion : inclusion, transectionHash : txHash }));

  } catch(err) {
    logger.error("Internal server error:", err);
     return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER)
       .json(errorResponse(ERROR_MESSAGE.INTERNAL_SERVER_ERROR, 
         { transectionDetail : { transectionHash :  err?.transactionHash,
                                 reason :  err?.reason,
                                 code :  err?.code}} ));
  }
}

module.exports = {
  burnStatus,
  startBurn,
}
