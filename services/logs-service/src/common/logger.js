const pino = require("pino");

/*
 * Pino Logger
 * ---------------------------------------------------------------------------
 * This logger is required by the project specification.
 * It is used to create structured log messages for every HTTP request
 * and for explicit endpoint access logs.
 */
const logger = pino({
    level: process.env.LOG_LEVEL || "info"
});

module.exports = { logger };
