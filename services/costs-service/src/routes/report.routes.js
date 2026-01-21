const { logger } = require("../common/logger");

const express = require("express");
const router = express.Router();

// Models required for report generation and computed storage.
const Cost = require("../models/cost");
const Report = require("../models/report");

// Shared error and validation helpers.
const { errorJson } = require("../common/errors");
const { parseIntStrict } = require("../common/validate");

// Check if requested (year, month) is in the past compared to current date.
function isPastMonth(year, month) {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    return year < y || (year === y && month < m);
}

// Create base structure matching the required sample JSON (all categories exist).
function emptyCostsSkeleton() {
    // Must match required structure: array of objects by category => list of items.
    return [
        { food: [] },
        { education: [] },
        { health: [] },
        { housing: [] },
        { sports: [] }
    ];
}

/*
 * GET /api/report?id=...&year=...&month=...
 * ---------------------------------------------------------------------------
 * Requirement: Return monthly report grouped by categories.
 *
 * Computed Design Pattern:
 *   - For a past month: first check if report exists in "reports" collection.
 *   - If exists => return it.
 *   - If not exists => compute from "costs", return it, and save it for future.
 */
router.get("/report", async (req, res) => {
    try {
        logger.info(
            {
                endpoint: "GET /api/report",
                userid: req.query.id,
                year: req.query.year,
                month: req.query.month
            },
            "Endpoint accessed"
        );
        // Parse query parameters strictly.
        const userId = parseIntStrict(req.query.id);
        const year = parseIntStrict(req.query.year);
        const month = parseIntStrict(req.query.month);

        // Validate query params existence and types.
        if (userId === null || year === null || month === null) {
            return res.status(400).json(errorJson(4001, "Invalid request parameters"));
        }

        // Validate month range 1..12.
        if (month < 1 || month > 12) return res.status(400).json(errorJson(4002, "Invalid month"));

        // Computed: if past month, attempt to return cached report if exists.
        if (isPastMonth(year, month)) {
            const existing = await Report.findOne({ userid: userId, year, month });
            if (existing) {
                // Return stored report (same structure).
                return res.status(200).json({
                    userid: existing.userid,
                    year: existing.year,
                    month: existing.month,
                    costs: existing.costs
                });
            }
        }

        // Build date range for the requested month.
        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Aggregate costs in MongoDB and group them by category.
        const agg = await Cost.aggregate([
            // Match by userid and date range.
            { $match: { userid: userId, date: { $gte: startDate, $lte: endDate } } },

            // Group by category and push required fields (sum, description, day).
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

        // Initialize response skeleton to ensure empty arrays for missing categories.
        const costs = emptyCostsSkeleton();

        // Fill each category array with aggregated details.
        agg.forEach((g) => {
            const idx = costs.findIndex((obj) => Object.prototype.hasOwnProperty.call(obj, g._id));
            if (idx !== -1) costs[idx][g._id] = g.details;
        });

        // Final computed response object.
        const computed = { userid: userId, year, month, costs };

        // Save only if past month (Computed caching requirement).
        if (isPastMonth(year, month)) {
            try {
                await Report.create(computed);
            } catch (_) {
                // Ignore duplicate key errors due to race conditions (another request saved).
            }
        }

        // Return computed report (cached or freshly aggregated).
        return res.status(200).json(computed);
    } catch (_) {
        // Return standard error JSON.
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
