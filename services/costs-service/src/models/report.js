const mongoose = require("mongoose");

/*
 * Report Schema (MongoDB: reports collection)
 * ---------------------------------------------------------------------------
 * Used for the Computed Design Pattern:
 *   When requesting a report for a past month, we compute it once and store it,
 *   then future requests for the same month return the stored report.
 */
const reportSchema = new mongoose.Schema({
    // User id for which the report belongs.
    userid: { type: Number, required: true, index: true },

    // Report year (e.g., 2026).
    year: { type: Number, required: true },

    // Report month (1-12).
    month: { type: Number, required: true },

    // Costs grouped by categories (matches the exact JSON structure required).
    costs: { type: Array, required: true },

    // When the report document was created.
    createdAt: { type: Date, default: Date.now }
});

// Ensure only one report per (userid, year, month).
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

// Export Mongoose model named "Report" (collection will be "reports").
module.exports = mongoose.model("Report", reportSchema);
