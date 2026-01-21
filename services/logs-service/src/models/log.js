const mongoose = require("mongoose");

/*
 * Log Schema (MongoDB: logs collection)
 * ---------------------------------------------------------------------------
 * Fields align with the "List of Logs" requirement:
 *   time, level, msg, method, url, statusCode
 */
const logSchema = new mongoose.Schema({
    // Timestamp when the log was created.
    time: { type: Date, default: Date.now },

    // Severity level (info/error/etc).
    level: { type: String, required: true },

    // Human-readable message (method + url + status + duration).
    msg: { type: String, required: true },

    // HTTP method (GET/POST/...).
    method: { type: String, required: true },

    // Requested URL path.
    url: { type: String, required: true },

    // Final response status code.
    statusCode: { type: Number, required: true }
});

// Export Mongoose model named "Log" (collection will be "logs").
module.exports = mongoose.model("Log", logSchema);
