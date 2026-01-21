const { logger } = require("../common/logger");

const express = require("express");
const router = express.Router();

/*
 * GET /api/about
 * ---------------------------------------------------------------------------
 * Requirement: "Developers Team"
 *
 * Rules:
 *   - The developers' names MUST NOT be stored in the database.
 *   - Names may be hardcoded or loaded from environment variables (.env).
 *   - The response must include ONLY:
 *       first_name, last_name
 *   - No additional properties are allowed in the response JSON.
 */
router.get("/about", (req, res) => {
    logger.info({ endpoint: "GET /api/about" }, "Endpoint accessed");

    // Team members details (loaded from environment variables or fallback values).
    const team = [
        {
            // First team member first and last name.
            first_name: process.env.TEAM_MEMBER_1_FIRST || "First",
            last_name: process.env.TEAM_MEMBER_1_LAST || "Last"
        },
        {
            // Second team member first and last name.
            first_name: process.env.TEAM_MEMBER_2_FIRST || "First2",
            last_name: process.env.TEAM_MEMBER_2_LAST || "Last2"
        }
    ];

    // Return the developers team details as JSON (HTTP 200).
    return res.status(200).json(team);
});

module.exports = router;
