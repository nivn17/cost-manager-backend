const mongoose = require("mongoose");

/*
 * MongoDB Connection Helper
 * ---------------------------------------------------------------------------
 * Keeps DB-related logic separate (as required: Mongoose usage is separated).
 * The actual URI is provided via .env (MONGO_URI).
 */

async function connectDB(mongoUri) {
    // Connect Mongoose to MongoDB Atlas (or any MongoDB instance).
    await mongoose.connect(mongoUri);
}

module.exports = { connectDB };
