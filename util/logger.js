// **********************************************************************
// * Changelog										
// * All notable changes to this project will be documented in this file.	
// **********************************************************************
// *
// * Author             : Parth Mehta
// *
// * Date created       : 05/05/2022
// *
// * Purpose            : Logger Util
// *
// * Revision History	:
// *
// * Date			Author			Jira			Functionality 
// * 
// *  
// **********************************************************************

const { createLogger, transports, format } = require("winston");
const LOGCONFIG = include("/configs/logger")

//INITIALIZE LOGGER
const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: LOGCONFIG.FILE,
            json: false,
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new transports.Console(),
    ]
});

module.exports = logger;