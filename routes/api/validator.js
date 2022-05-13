// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 12/05/2022
// *
// * Purpose			: validator APIs.
// *
// * Revision History	:
// *
// **********************************************************************

const router = require("express").Router();
const validatorController = require("../../controllers/v1/validator.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.get("/info", validatorController.getInfo);

module.exports = router;