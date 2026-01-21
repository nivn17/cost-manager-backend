const express = require("express");
const router = express.Router();

const Cost = require("../models/cost");
const User = require("../models/user");
const { errorJson } = require("../common/errors");
const {
    isNonEmptyString,
    isValidCategory,
    parseIntStrict,
    parseNumberStrict,
    parseCostDateOrNow,
    isPastDate
} = require("../common/validate");

// POST /api/add  (adding cost)
router.post("/add", async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body || {};

        const userId = parseIntStrict(userid);
        if (userId === null) return res.status(400).json(errorJson(4001, "Invalid userid"));

        // required: check user exists
        const userExists = await User.findOne({ id: userId }).select({ id: 1 });
        if (!userExists) return res.status(400).json(errorJson(4002, "User does not exist"));

        if (!isNonEmptyString(description)) return res.status(400).json(errorJson(4003, "Invalid description"));
        if (!isValidCategory(category)) return res.status(400).json(errorJson(4004, "Invalid category"));

        const s = parseNumberStrict(sum);
        if (s === null) return res.status(400).json(errorJson(4005, "Invalid sum"));

        const d = parseCostDateOrNow(date);
        if (!d) return res.status(400).json(errorJson(4006, "Invalid date"));

        // required: no past dates
        if (isPastDate(d)) return res.status(400).json(errorJson(4007, "Past dates are not allowed"));

        const cost = await Cost.create({
            description: description.trim(),
            category,
            userid: userId,
            sum: s,
            date: d
        });

        // response: JSON describing added cost item (same field names)
        return res.status(201).json({
            description: cost.description,
            category: cost.category,
            userid: cost.userid,
            sum: cost.sum,
            date: cost.date
        });
    } catch (_) {
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
