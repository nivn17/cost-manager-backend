const { logger } = require("../common/logger");

const express = require("express");
const router = express.Router();

// Log model for the logs collection.
const Log = require("../models/log");

// Shared error helper (must return {id, message}).
const { errorJson } = require("../common/errors");

/*
 * GET /api/logs
 * ---------------------------------------------------------------------------
 * Requirement: "List of Logs"
 *   - Return JSON document that describes all logs.
 *   - Property names should match the logs collection fields.
 * Notes:
 *   - We sort by time descending so newest logs appear first.
 */
router.get("/logs", async (req, res) => {
    try {
        logger.info({ endpoint: "GET /api/logs" }, "Endpoint accessed");

        // Fetch all logs and sort by time (newest first).
        const logs = await Log.find({}).sort({ time: -1 });

        // Return logs list as JSON.
        return res.status(200).json(logs);
    } catch (err) {
        // Return standard error JSON.
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
