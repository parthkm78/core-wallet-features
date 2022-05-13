// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author				: Parth Mehta
// *
// * Date created		: 05/05/2022
// *
// * Purpose			: Contains all the Global declarations
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *
// **********************************************************************

/**
 * Returns a "require", appending 
 * the path to the root directory
 * 
 * @param {string} path 
 * @return {require}
 **/
global.include = function (path) {
    return require(__dirname + path);
}
