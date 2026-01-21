const express = require("express");
const router = express.Router();

// Import User model (users collection).
const User = require("../models/user");

// Shared error helper (must return {id, message}).
const { errorJson } = require("../common/errors");

// Validation helpers for input validation (required by spec Q&A).
const { isNonEmptyString, parseIntStrict, parseDateStrict } = require("../common/validate");

/*
 * POST /api/add  (Adding User)
 * ---------------------------------------------------------------------------
 * Requirement:
 *   - Add a new user to the users collection.
 *   - Request body must include (at minimum): id, first_name, last_name, birthday
 *   - Response must return JSON describing the added user using the same names.
 * Error handling:
 *   - Return JSON error object with at least: { id, message }.
 */
router.post("/add", async (req, res) => {
    try {
        // Extract input fields from the request body (fallback to {} to avoid crash).
        const { id, first_name, last_name, birthday } = req.body || {};

        // Validate user id (spec: id is Number, and is separate from MongoDB _id).
        const userId = parseIntStrict(id);
        if (userId === null) return res.status(400).json(errorJson(4001, "Invalid id"));

        // Validate first_name and last_name as non-empty strings.
        if (!isNonEmptyString(first_name)) return res.status(400).json(errorJson(4002, "Invalid first_name"));
        if (!isNonEmptyString(last_name)) return res.status(400).json(errorJson(4003, "Invalid last_name"));

        // Validate birthday as a valid Date.
        const b = parseDateStrict(birthday);
        if (!b) return res.status(400).json(errorJson(4004, "Invalid birthday"));

        // Create a new user document in MongoDB.
        const user = await User.create({
            id: userId,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            birthday: b
        });

        // Requirement: return JSON describing the added user (same property names).
        return res.status(201).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday
        });
    } catch (err) {
        // Handle duplicate key error for unique user id (Mongo error code 11000).
        if (err && err.code === 11000) {
            return res.status(400).json(errorJson(4005, "User id already exists"));
        }

        // Fallback: internal server error.
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
