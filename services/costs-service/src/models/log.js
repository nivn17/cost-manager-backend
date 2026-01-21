const mongoose = require("mongoose");

/*
 * Log Schema (MongoDB: logs collection)
 * ---------------------------------------------------------------------------
 * Required fields per logs endpoint requirement:
 *   time, level, msg, method, url, statusCode
 */
const logSchema = new mongoose.Schema({
    // Timestamp of log creation.
    time: { type: Date, default: Date.now },

    // Log severity (info/error/etc).
    level: { type: String, required: true },

    // Human-readable log message.
    msg: { type: String, required: true },

    // Request method.
    method: { type: String, required: true },

    // Requested URL.
    url: { type: String, required: true },

    // Final response status code.
    statusCode: { type: Number, required: true }
});

// Export Mongoose model named "Log" (collection will be "logs").
module.exports = mongoose.model("Log", logSchema);
