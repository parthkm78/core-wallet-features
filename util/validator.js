
const { ethers,  Wallet, utils } = require('ethers')

const isVaidatorExists = async(ethKeys, validatorAdd ) => {
    let validator = null;
    for(let i = 0; i < ethKeys.validators.length; i += 1) {
        if(ethKeys.validators[i].address === validatorAdd) {
            validator = ethKeys.validators[i]
            break;
        }
      }
    
      // if key not exists then find from test accounts
      if(!validator && ethKeys.tests) {
        console.log("could not find key", validatorAdd, "in bootstrap valset - checking test accounts")
        for(let i = 0; i < ethKeys.tests.length; i += 1) {
          if(ethKeys.tests[i].address === validatorAdd) {
            validator = ethKeys.tests[i];
            break;
          }
        }
      }
      return validator;
  }


  const JsonRpcProvider = async(url ) => {
    return new ethers.providers.JsonRpcProvider(url);
  }

  module.exports = {
    isVaidatorExists,
    JsonRpcProvider
  }
  