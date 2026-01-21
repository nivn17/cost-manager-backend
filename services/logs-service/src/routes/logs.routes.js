const express = require("express");
const router = express.Router();
const Log = require("../models/log");
const { errorJson } = require("../common/errors");

router.get("/logs", async (req, res) => {
    try {
        const logs = await Log.find({}).sort({ time: -1 });
        return res.status(200).json(logs);
    } catch (err) {
        return res.status(500).json(errorJson(5001, "Internal Server Error"));
    }
});

module.exports = router;
