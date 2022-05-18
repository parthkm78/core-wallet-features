const posTokens = require('../configs/tokens/pos.js')
const plasmaTokens = require('../configs/tokens/plasma.js')
const Network = require( "./network.js" )

const {
  MNEMONIC,
  NET_NAME,
  NET_TYPE,
  ROOT_RPC_HTTP,
  ROOT_WS_HTTP,
  CHILD_RPC_HTTP,
  CHILD_WS_HTTP
} = process.env

const networkInfo = new Network(NET_NAME, NET_TYPE)

module.exports = {
  tokens: {
    pos: posTokens,
    plasma: plasmaTokens,
  },
  account: {
    mnemonic: MNEMONIC,
  },
  network: {
    parent: {
      rpc: ROOT_RPC_HTTP,
      ws: ROOT_WS_HTTP,
    },
    child: {
      rpc: CHILD_RPC_HTTP,
      ws: CHILD_WS_HTTP,
    },
    data: networkInfo,
  },
}
