// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 16/05/2022
// *
// * Purpose			: validator APIs.
// *
// * Revision History	:
// *
// **********************************************************************

const router = require("express").Router();
const transferController = require("../../controllers/v1/transfer.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.post("/eth", transferController.sendETH);

router.post("/bone", transferController.sendBone);

router.post("/:clientType", transferController.sendL2Asset);

module.exports = router;