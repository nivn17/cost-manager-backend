const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    time: { type: Date, default: Date.now },
    level: { type: String, required: true },
    msg: { type: String, required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    statusCode: { type: Number, required: true }
});

module.exports = mongoose.model("Log", logSchema);
