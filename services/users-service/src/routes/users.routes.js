const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cost = require("../models/cost");
const { errorJson } = require("../common/errors");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, id: 1, first_name: 1, last_name: 1, birthday: 1 });
        return res.status(200).json(users);
    } catch (_) {
        return res.status(500).json(errorJson(5002, "Internal Server Error"));
    }
});

// GET /api/users/:id => {first_name,last_name,id,total}
router.get("/users/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (!Number.isInteger(userId)) return res.status(400).json(errorJson(4006, "Invalid user id"));

        const user = await User.findOne({ id: userId });
        if (!user) return res.status(404).json(errorJson(4041, "User not found"));

        const agg = await Cost.aggregate([
            { $match: { userid: userId } },
            { $group: { _id: "$userid", total: { $sum: "$sum" } } }
        ]);

        const total = agg.length ? agg[0].total : 0;

        return res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });
    } catch (_) {
        return res.status(500).json(errorJson(5003, "Internal Server Error"));
    }
});

module.exports = router;
