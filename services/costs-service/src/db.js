const mongoose = require("mongoose");

/*
 * MongoDB Connection Helper
 * ---------------------------------------------------------------------------
 * Keeps DB connection logic in a separate file.
 * The URI comes from environment variables (.env -> MONGO_URI).
 */
async function connectDB(mongoUri) {
    // Establish a connection to MongoDB Atlas using Mongoose.
    await mongoose.connect(mongoUri);
}

module.exports = { connectDB };
