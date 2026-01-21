const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
    // Must NOT be stored in DB. Hardcoded / env allowed.
    const team = [
        {
            first_name: process.env.TEAM_MEMBER_1_FIRST || "First",
            last_name: process.env.TEAM_MEMBER_1_LAST || "Last"
        },
        {
            first_name: process.env.TEAM_MEMBER_2_FIRST || "First2",
            last_name: process.env.TEAM_MEMBER_2_LAST || "Last2"
        }
    ];
    return res.status(200).json(team);
});

module.exports = router;
