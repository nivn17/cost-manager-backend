const mongoose = require("mongoose");

/*
 * MongoDB Connection Helper
 * ---------------------------------------------------------------------------
 * Keeps DB connection logic separate from app/routes.
 * The connection string comes from environment variables (.env -> MONGO_URI).
 */
async function connectDB(mongoUri) {
    // Connect Mongoose to MongoDB Atlas (or any MongoDB instance).
    await mongoose.connect(mongoUri);
}

module.exports = { connectDB };
