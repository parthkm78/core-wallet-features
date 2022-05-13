
const { ethers,  Wallet, utils } = require('ethers');

const parseEther = async ( number ) => {
    return ethers.utils.parseEther(number);
}

module.exports = {
    parseEther,
  };