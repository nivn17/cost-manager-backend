const mongoose = require("mongoose");

/*
 * User Schema (MongoDB: users collection)
 * ---------------------------------------------------------------------------
 * Required properties per spec:
 *   id: Number   (NOTE: id and _id are different properties!)
 *   first_name: String
 *   last_name: String
 *   birthday: Date
 */
const userSchema = new mongoose.Schema({
    // User id (NOT _id). Must be unique.
    id: { type: Number, required: true, unique: true, index: true },

    // User first name.
    first_name: { type: String, required: true },

    // User last name.
    last_name: { type: String, required: true },

    // User birthday (Date).
    birthday: { type: Date, required: true }
});

// Export Mongoose model named "User" (collection will be "users").
module.exports = mongoose.model("User", userSchema);
