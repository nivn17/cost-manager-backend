const mongoose = require("mongoose");

/*
 * Cost Schema (MongoDB: costs collection)
 * ---------------------------------------------------------------------------
 * This file exists because the service may need to compute totals for a user,
 * and/or other endpoints might query costs by userid.
 *
 * Required properties per spec:
 *   description: String
 *   category: String
 *   userid: Number
 *   sum: Double  -> in JS/Mongoose we store as Number
 */
const costSchema = new mongoose.Schema({
    // Description of the cost item.
    description: { type: String, required: true, trim: true },

    // Category of the cost item (in costs-service this is enum validated).
    category: { type: String, required: true },

    // User id (NOT Mongo _id). Indexed for queries by userid.
    userid: { type: Number, required: true, index: true },

    // Spec says "Double" - in Mongoose we store numeric values as Number.
    sum: { type: Number, required: true },

    // Creation date (used for time-based queries).
    date: { type: Date, default: Date.now }
});

// Export Mongoose model named "Cost" (collection will be "costs").
module.exports = mongoose.model("Cost", costSchema);
