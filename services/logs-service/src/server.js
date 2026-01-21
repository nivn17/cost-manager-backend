require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

/*
 * Service Bootstrap
 * ---------------------------------------------------------------------------
 * Steps:
 *   1) Load .env
 *   2) Connect to MongoDB
 *   3) Start Express server on PORT (logs-service default: 3001)
 */
async function main() {
    // Connect to MongoDB before accepting requests.
    await connectDB(process.env.MONGO_URI);

    // Use PORT from env or fallback to default for this service.
    const port = Number(process.env.PORT) || 3001;

    // Start listening for incoming requests.
    app.listen(port, () => console.log(`logs-service listening on ${port}`));
}

// If startup fails, log and exit with non-zero code.
main().catch((e) => {
    console.error("logs-service failed:", e.message);
    process.exit(1);
});
