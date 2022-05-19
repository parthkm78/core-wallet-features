const router = require("express").Router();
const tokenController = require("../../controllers/v1/token.js");
const { errorResponse, successResponse } = require("../../util/response.js");
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require("../../util/constants.js");

router.get("/info/:tokenAddress", tokenController.getInfo);
router.get("/list/plasma", tokenController.getPlasma);
router.get("/list/pos", tokenController.getPos);

module.exports = router;
