// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 12/05/2022
// *
// * Purpose			: Stakerelated APIs.
// *
// * Revision History	:
// *
// **********************************************************************

const router = require("express").Router();
const stakeController = require("../../controllers/v1/stake.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.post("/add", stakeController.stake)
.all((req, res) => {
  return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
});

router.post("/restake", stakeController.reStake)
.all((req, res) => {
  return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOW).json(errorResponse(ERROR_MESSAGE.METHOD_NOT_ALLOWED))
});
module.exports = router;