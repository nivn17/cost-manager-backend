const mongoose = require("mongoose");

/*
 * User Schema (MongoDB: users collection)
 * ---------------------------------------------------------------------------
 * Required properties per spec:
 *   id: Number (IMPORTANT: id != _id)
 *   first_name: String
 *   last_name: String
 *   birthday: Date
 */
const userSchema = new mongoose.Schema({
    // User id (separate from MongoDB _id).
    id: { type: Number, required: true, unique: true, index: true },

    // First name (trim extra spaces).
    first_name: { type: String, required: true, trim: true },

    // Last name (trim extra spaces).
    last_name: { type: String, required: true, trim: true },

    // Birthday date.
    birthday: { type: Date, required: true }
});

// Export Mongoose model named "User" (collection will be "users").
module.exports = mongoose.model("User", userSchema);
