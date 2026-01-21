require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

async function main() {
    await connectDB(process.env.MONGO_URI);
    const port = Number(process.env.PORT) || 3002;
    app.listen(port, () => console.log(`users-service listening on ${port}`));
}

main().catch((e) => {
    console.error("users-service failed:", e.message);
    process.exit(1);
});
