require("dotenv").config();
const { app } = require("./app");
const { connectDB } = require("./db");

async function main() {
    await connectDB(process.env.MONGO_URI);
    const port = Number(process.env.PORT) || 3003;
    app.listen(port, () => console.log(`costs-service listening on ${port}`));
}

main().catch((e) => {
    console.error("costs-service failed:", e.message);
    process.exit(1);
});
