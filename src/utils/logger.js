const winston = require("winston");

const logger = winston.createLogger({
    level: "info",  // Log levels: error, warn, info, http, verbose, debug, silly
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),  // Logs to console
        new winston.transports.File({ filename: "app.log" })  // Logs to file
    ],
});

module.exports = logger;
