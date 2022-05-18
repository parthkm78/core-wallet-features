// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 08/05/2022
// *
// * Purpose			: Constants
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *
// **********************************************************************

// ERROR MESSAGE CONSTANTS
const ERROR_MESSAGE = {
    USERNAME_PASSWORD_INCORRECT: "Username or Password is Incorrect",
    REQUIRED_PARAMETERS_MISSING: "Required parameters are missing",
    INSUFFICIENT_BALANCE: "Insufficient balance",
    INTERNAL_SERVER_ERROR: "Internal server error",
    VALIDATOR_NOT_EXISTS : "validator not exists",
    REQUIRE_TOKEN: "No token available, authorization denied!",
    INVALID_TOKEN: "Invalid Token, authorization denied",
}

// HTTP STATUS CODES
const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOW: 405,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
}

// EXPORT MODULE
module.exports = {
    ERROR_MESSAGE,
    HTTP_STATUS_CODE
};