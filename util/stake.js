const getValId = async(valAddr, stakeManagerContract) => {
    const valId = await stakeManagerContract.getValidatorId(valAddr).call()
    return valId
  }

  module.exports = {
    getValId
  }
  