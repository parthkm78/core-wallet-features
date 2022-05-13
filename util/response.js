// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author             : Parth Mehta
// *
// * Date created       : 05/02/2021
// *
// * Purpose            : Response Util
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *  
// **********************************************************************

/**
 * Formats the error response structure
 * 
 * @param {string} message Error Message
 * @param {string[]} data Error Data
 * @return {object} Error response object
 **/
errorResponse = (message, data = []) => {
    return { "status": "error", "message": message, "data": data };
}

/**
 * Formats the success response structure
 * 
 * @param {string} message success Message
 * @param {object} data success Data
 * @return {object} success response object
 **/
successResponse = (message, data) => {
    return { "status": "success", "message": message, "data": data };
}

module.exports = {
    errorResponse,
    successResponse
};