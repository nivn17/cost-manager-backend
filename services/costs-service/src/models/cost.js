const mongoose = require("mongoose");

const costSchema = new mongoose.Schema({
    description: { type: String, required: true, trim: true },
    category: {
        type: String,
        required: true,
        enum: ["food", "health", "housing", "sports", "education"]
    },
    userid: { type: Number, required: true, index: true },
    // per spec: Double => use Number
    sum: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cost", costSchema);
