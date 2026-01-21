const express = require("express");
const router = express.Router();
const Cost = require("../models/cost");
const Report = require("../models/report");
const { errorJson } = require("../common/errors");
const { parseIntStrict } = require("../common/validate");

function isPastMonth(year, month) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    return year < y || (year === y && month < m);
}

function emptyCostsSkeleton() {
    // match sample structure: array of objects, each category key => []
    return [
        { food: [] },
        { education: [] },
        { health: [] },
        { housing: [] },
        { sports: [] }
    ];
}

router.get("/report", async (req, res) => {
    try {
        const userId = parseIntStrict(req.query.id);
        const year = parseIntStrict(req.query.year);
        const month = parseIntStrict(req.query.month);

        if (userId === null || year === null || month === null) {
            return res.status(400).json(errorJson(4001, "Invalid request parameters"));
        }
        if (month < 1 || month > 12) return res.status(400).json(errorJson(4002, "Invalid month"));

        // Computed: if past month, return saved if exists
        if (isPastMonth(year, month)) {
            const existing = await Report.findOne({ userid: userId, year, month });
            if (existing) {
                return res.status(200).json({
                    userid: existing.userid,
                    year: existing.year,
                    month: existing.month,
                    costs: existing.costs
                });
            }
        }

        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const agg = await Cost.aggregate([
            { $match: { userid: userId, date: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: "$category",
                    details: {
                        $push: {
                            sum: "$sum",
                            description: "$description",
                            day: { $dayOfMonth: "$date" }
                        }
                    }
                }
            }
        ]);

        const costs = emptyCostsSkeleton();

        agg.forEach((g) => {
            const idx = costs.findIndex((obj) => Object.prototype.hasOwnProperty.call(obj, g._id));
            if (idx !== -1) costs[idx][g._id] = g.details;
        });

        const computed = { userid: userId, year, month, costs };

        // save only if past month
        if (isPastMonth(year, month)) {
            try {
                await Report.create(computed);
            } catch (_) {
                // ignore dup/race
            }
        }

        return res.status(200).json(computed);
    } catch (_) {
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
