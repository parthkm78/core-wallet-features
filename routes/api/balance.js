const router = require("express").Router();
const balanceController = require("../../controllers/v1/balance.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.get("/bor/:id", balanceController.bor);
module.exports = router;

// /balance/bor/:id
