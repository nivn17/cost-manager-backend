const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { errorJson } = require("../common/errors");
const { isNonEmptyString, parseIntStrict, parseDateStrict } = require("../common/validate");

// POST /api/add  (adding user)
router.post("/add", async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body || {};

        const userId = parseIntStrict(id);
        if (userId === null) return res.status(400).json(errorJson(4001, "Invalid id"));

        if (!isNonEmptyString(first_name)) return res.status(400).json(errorJson(4002, "Invalid first_name"));
        if (!isNonEmptyString(last_name)) return res.status(400).json(errorJson(4003, "Invalid last_name"));

        const b = parseDateStrict(birthday);
        if (!b) return res.status(400).json(errorJson(4004, "Invalid birthday"));

        const user = await User.create({
            id: userId,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            birthday: b
        });

        // spec: return JSON describing added user
        return res.status(201).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday
        });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(400).json(errorJson(4005, "User id already exists"));
        }
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
