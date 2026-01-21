const express = require("express");
const cors = require("cors");
const logsRoutes = require("./routes/logs.routes");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger());

// external API (as required)
app.use("/api", logsRoutes);

// fallback
app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
