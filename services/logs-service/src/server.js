require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

async function main() {
    await connectDB(process.env.MONGO_URI);

    const port = Number(process.env.PORT) || 3001;
    app.listen(port, () => console.log(`logs-service listening on ${port}`));
}

main().catch((e) => {
    console.error("logs-service failed:", e.message);
    process.exit(1);
});
