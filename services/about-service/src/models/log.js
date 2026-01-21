const mongoose = require("mongoose");

/*
 * Log Schema (MongoDB: logs collection)
 * ---------------------------------------------------------------------------
 * This collection stores a log document for:
 *   1) Every HTTP request (middleware),
 *   2) And optionally any additional endpoint-access logs you decide to add.
 *
 * Required fields are aligned with the "List of Logs" requirement:
 *   time, level, msg, method, url, statusCode
 */
const logSchema = new mongoose.Schema({
    // When the log was created (default: now).
    time: { type: Date, default: Date.now },

    // Log severity level (e.g., "info", "error").
    level: { type: String, required: true },

    // Human-readable log message.
    msg: { type: String, required: true },

    // HTTP method (GET/POST/PUT/DELETE...).
    method: { type: String, required: true },

    // Requested URL path (including route).
    url: { type: String, required: true },

    // HTTP response status code (e.g., 200/404/500).
    statusCode: { type: Number, required: true }
});

// Export Mongoose model named "Log" (collection will be "logs").
module.exports = mongoose.model("Log", logSchema);
