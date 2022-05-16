const router = require("express").Router();
const tokenController = require("../../controllers/v1/token.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.get("/info/:id", tokenController.getInfo);

module.exports = router;
