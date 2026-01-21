const Log = require("../models/log");
const { logger } = require("../common/logger");

/*
 * Request Logger Middleware (Pino + MongoDB)
 * ---------------------------------------------------------------------------
 * Requirement:
 *   - Use Pino for creating log messages
 *   - Save logs to MongoDB for every HTTP request
 */
function requestLogger() {
    return function (req, res, next) {
        const start = Date.now();

        res.on("finish", async () => {
            try {
                const durationMs = Date.now() - start;

                //  Pino log (required by assignment)
                logger.info(
                    {
                        method: req.method,
                        url: req.originalUrl,
                        statusCode: res.statusCode,
                        durationMs
                    },
                    "HTTP request finished"
                );

                // MongoDB log (required by assignment)
                const msg = `HTTP ${req.method} ${req.originalUrl} ${res.statusCode} (${durationMs}ms)`;

                await Log.create({
                    level: "info",
                    msg,
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    time: new Date()
                });
            } catch (_) {
                // Logging must never break request flow
            }
        });

        next();
    };
}

module.exports = { requestLogger };
