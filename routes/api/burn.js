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
const burnController = require("../../controllers/v1/burn.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");


router.post("/:clientType", burnController.startBurn);
router.get("/status/:clientType/:tx", burnController.burnStatus);


module.exports = router;