const express = require("express");
const router = express.Router();
const { logger } = require("../common/logger");

// Import models required for the endpoint.
const Cost = require("../models/cost");
const User = require("../models/user");

// Import shared error helper and validation helpers.
const { errorJson } = require("../common/errors");
const {
    isNonEmptyString,
    isValidCategory,
    parseIntStrict,
    parseNumberStrict,
    parseCostDateOrNow,
    isPastDate
} = require("../common/validate");

/*
 * POST /api/add
 * ---------------------------------------------------------------------------
 * Requirement: Add a new cost item.
 * Body params (min): description, category, userid, sum
 * Optional: date (if not provided => server uses "now")
 * Additional requirement (Q&A): must verify that userid exists.
 * Additional requirement: server does not allow adding costs with past dates.
 */
router.post("/add", async (req, res) => {
    try {
        logger.info({ endpoint: "POST /api/add" }, "Endpoint accessed");
        // Extract fields from request body (fallback to {} to avoid crash).
        const { description, category, userid, sum, date } = req.body || {};

        // Validate userid as strict integer.
        const userId = parseIntStrict(userid);
        if (userId === null) return res.status(400).json(errorJson(4001, "Invalid userid"));

        // Requirement: check that user exists in users collection.
        const userExists = await User.findOne({ id: userId }).select({ id: 1 });
        if (!userExists) return res.status(400).json(errorJson(4002, "User does not exist"));

        // Validate description (must be non-empty string).
        if (!isNonEmptyString(description)) return res.status(400).json(errorJson(4003, "Invalid description"));

        // Validate category based on required list.
        if (!isValidCategory(category)) return res.status(400).json(errorJson(4004, "Invalid category"));

        // Validate sum as finite number.
        const s = parseNumberStrict(sum);
        if (s === null) return res.status(400).json(errorJson(4005, "Invalid sum"));

        // Parse date if provided, else use now.
        const d = parseCostDateOrNow(date);
        if (!d) return res.status(400).json(errorJson(4006, "Invalid date"));

        // Requirement: do not allow adding costs in the past.
        if (isPastDate(d)) return res.status(400).json(errorJson(4007, "Past dates are not allowed"));

        // Create a cost document in MongoDB.
        const cost = await Cost.create({
            description: description.trim(),
            category,
            userid: userId,
            sum: s,
            date: d
        });

        // Respond with JSON describing the added cost item (same property names).
        return res.status(201).json({
            description: cost.description,
            category: cost.category,
            userid: cost.userid,
            sum: cost.sum,
            date: cost.date
        });
    } catch (_) {
        // Return standard error JSON (id + message).
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
