require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

/*
 * Service Bootstrap
 * ---------------------------------------------------------------------------
 * Steps:
 *   1) Load environment variables (.env)
 *   2) Connect to MongoDB
 *   3) Start Express server on PORT
 *
 * Note: Each process/service must run independently (separate port if same host).
 */

async function main() {
    // Connect to DB using MONGO_URI from environment variables.
    await connectDB(process.env.MONGO_URI);

    // Choose port from env; fallback to 3004.
    const port = Number(process.env.PORT) || 3004;

    // Start listening for incoming HTTP requests.
    app.listen(port, () => console.log(`about-service listening on ${port}`));
}

// Start the service; on fatal error, exit with code 1.
main().catch((e) => {
    console.error("about-service failed:", e.message);
    process.exit(1);
});
