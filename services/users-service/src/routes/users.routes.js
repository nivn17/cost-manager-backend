const { logger } = require("../common/logger");
const express = require("express");
const router = express.Router();

// User model for users collection.
const User = require("../models/user");

// Cost model for computing total costs per user.
const Cost = require("../models/cost");

// Shared error helper (must return {id, message}).
const { errorJson } = require("../common/errors");

/*
 * GET /api/users
 * ---------------------------------------------------------------------------
 * Requirement: "List of Users"
 *   - Return JSON list describing all users.
 *   - Property names must match the users collection schema:
 *       id, first_name, last_name, birthday
 * Notes:
 *   - We exclude MongoDB internal _id field in the projection.
 */
router.get("/users", async (req, res) => {
    try {
        logger.info({ endpoint: "GET /api/users" }, "Endpoint accessed");
        // Fetch all users with the required fields only (exclude _id).
        const users = await User.find({}, { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 });

        // Return the users list as JSON.
        return res.status(200).json(users);
    } catch (_) {
        // Return standard error JSON.
        return res.status(500).json(errorJson(5002, "Internal Server Error"));
    }
});

/*
 * GET /api/users/:id
 * ---------------------------------------------------------------------------
 * Requirement: "Getting The Details of a Specific User"
 *   - Return JSON with: first_name, last_name, id, total
 *   - "total" is the sum of all costs for that specific user.
 * Error handling:
 *   - Invalid id => 400 + error JSON
 *   - Not found  => 404 + error JSON
 */
router.get("/users/:id", async (req, res) => {
    try {
        logger.info(
            { endpoint: "GET /api/users/:id", userId: req.params.id },
            "Endpoint accessed"
        );
        // Parse user id from URL param and validate as integer.
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId)) return res.status(400).json(errorJson(4006, "Invalid user id"));

        // Fetch the user document by "id" (not Mongo _id).
        const user = await User.findOne({ id: userId });
        if (!user) return res.status(404).json(errorJson(4041, "User not found"));

        // Compute total costs for this user using MongoDB aggregation.
        const agg = await Cost.aggregate([
            // Match all costs belonging to this user.
            { $match: { userid: userId } },

            // Group and sum all "sum" fields to compute total.
            { $group: { _id: "$userid", total: { $sum: "$sum" } } }
        ]);

        // If user has no costs, total should be 0.
        const total = agg.length ? agg[0].total : 0;

        // Return the exact structure required by the spec.
        return res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });
    } catch (_) {
        // Return standard error JSON.
        return res.status(500).json(errorJson(5003, "Internal Server Error"));
    }
});

module.exports = router;
