require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

/*
 * Service Bootstrap
 * ---------------------------------------------------------------------------
 * Steps:
 *   1) Load .env
 *   2) Connect to MongoDB
 *   3) Start Express server on PORT (unique per process if same host)
 */
async function main() {
    // Connect to MongoDB using the URI from .env.
    await connectDB(process.env.MONGO_URI);

    // Use PORT from env, fallback to default for this service.
    const port = Number(process.env.PORT) || 3003;

    // Start listening.
    app.listen(port, () => console.log(`costs-service listening on ${port}`));
}

// If startup fails, log and exit with error code.
main().catch((e) => {
    console.error("costs-service failed:", e.message);
    process.exit(1);
});
