const express = require("express");
const cors = require("cors");
const logsRoutes = require("./routes/logs.routes");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

const app = express();

/*
 * Express App Setup
 * ---------------------------------------------------------------------------
 * - cors(): allow cross-origin requests.
 * - express.json(): parse JSON request bodies.
 * - requestLogger(): save log entry in MongoDB for every HTTP request.
 */
app.use(cors());
app.use(express.json());
app.use(requestLogger());

/*
 * Routes Mounting
 * ---------------------------------------------------------------------------
 * Required endpoint for this process:
 *   - GET /api/logs
 */
app.use("/api", logsRoutes);

// Fallback for unknown routes (error must include id + message).
app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
