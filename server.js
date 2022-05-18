// **********************************************************************
// * Changelog
// * All notable changes to this project will be documented in this file.
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 08/10/2020
// *
// * Purpose			: Contains all the initializations for routes, mongodb and server
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality
// *
// **********************************************************************

const express = require("express");
const app = express();
require("./globals");
const cors = require("cors");
const admin = require("firebase-admin");
const https = require("https");
const http = require("http");
const fs = require("fs");
const helmet = require("helmet");
const logger = include("/util/logger");

require("dotenv").config();
app.use(cors());

// For parsing application/json
app.use(express.json({ limit: "30mb" }));

// Force all connections through https
app.use(helmet());

// ROUTES
const swapRouter = require("./routes/api/stake.js");
app.use("/stake", swapRouter);

const validatorRouter = require("./routes/api/validator.js");
app.use("/validator", validatorRouter);

const balanceRouter = require("./routes/api/balance.js");
app.use("/balance", balanceRouter);

const transferRouter = require("./routes/api/transfer.js");
app.use("/transfer", transferRouter);

const tokenRouter = require("./routes/api/token.js");
app.use("/token", tokenRouter);

const accountRouter = require("./routes/api/account.js");
app.use("/account", accountRouter);

// Start Server
const port = process.env.PORT || 5020;
http.createServer(null, app).listen(port, () => {
  logger.info("HTTP Server is running on port:" + port);
  // Initialize Server Issuer Agent
});
