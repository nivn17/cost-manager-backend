const mongoose = require("mongoose");

/*
 * Cost Schema (MongoDB: costs collection)
 * ---------------------------------------------------------------------------
 * Required properties per spec:
 *   description: String
 *   category: String (food/health/housing/sports/education)
 *   userid: Number
 *   sum: Double  -> in JS/Mongoose we use Number
 * Also keeping "date" (creation date) to support monthly report by month/year.
 */
const costSchema = new mongoose.Schema({
    // Short description of the cost item (trim to avoid leading/trailing spaces).
    description: { type: String, required: true, trim: true },

    // Category must be one of the allowed values.
    category: {
        type: String,
        required: true,
        enum: ["food", "health", "housing", "sports", "education"]
    },

    // User id (NOT Mongo _id) - required and indexed for queries and aggregation.
    userid: { type: Number, required: true, index: true },

    // Spec says "Double"; in Mongoose we store it as Number.
    sum: { type: Number, required: true },

    // If date not provided, server uses request time (now) as required by spec.
    date: { type: Date, default: Date.now }
});

// Export Mongoose model named "Cost" (collection will be "costs").
module.exports = mongoose.model("Cost", costSchema);
