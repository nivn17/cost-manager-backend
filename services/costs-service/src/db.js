const mongoose = require("mongoose");

async function connectDB(mongoUri) {
    await mongoose.connect(mongoUri);
}

module.exports = { connectDB };
