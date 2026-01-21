require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

/*
 * Service Bootstrap
 * ---------------------------------------------------------------------------
 * Steps:
 *   1) Load environment variables (.env)
 *   2) Connect to MongoDB using MONGO_URI
 *   3) Start Express server on a dedicated port (users-service => 3002 default)
 */
async function main() {
    // Connect to MongoDB before accepting requests.
    await connectDB(process.env.MONGO_URI);

    // Use PORT from env or fallback to the service default.
    const port = Number(process.env.PORT) || 3002;

    // Start listening for incoming requests.
    app.listen(port, () => console.log(`users-service listening on ${port}`));
}

// If startup fails, print error and exit with non-zero code.
main().catch((e) => {
    console.error("users-service failed:", e.message);
    process.exit(1);
});
