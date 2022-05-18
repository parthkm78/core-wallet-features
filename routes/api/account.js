const router = require("express").Router();
const accountController = require("../../controllers/v1/account.js");

router.get("/list", accountController.getAccounts);

module.exports = router;
