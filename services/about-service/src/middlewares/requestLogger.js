const Log = require("../models/log");

function requestLogger() {
    return function (req, res, next) {
        const start = Date.now();
        res.on("finish", async () => {
            try {
                const msg = `HTTP ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - start}ms)`;
                await Log.create({
                    level: "info",
                    msg,
                    method: req.method,
                    url: req.originalUrl,
                    statusCode: res.statusCode,
                    time: new Date()
                });
            } catch (_) {}
        });
        next();
    };
}

module.exports = { requestLogger };
