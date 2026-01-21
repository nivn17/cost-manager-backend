const express = require("express");
const cors = require("cors");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

// Import routes for cost-service endpoints.
const addRoutes = require("./routes/add.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

/*
 * Express App Setup
 * ---------------------------------------------------------------------------
 * - cors(): allow front-end access.
 * - express.json(): parse JSON request bodies.
 * - requestLogger(): store logs in MongoDB for each HTTP request.
 */
app.use(cors());
app.use(express.json());
app.use(requestLogger());

/*
 * Routes Mounting
 * ---------------------------------------------------------------------------
 * Required endpoints for this process:
 *   - POST /api/add
 *   - GET  /api/report
 */
app.use("/api", addRoutes);
app.use("/api", reportRoutes);

// Fallback for unknown routes (error must include: id + message).
app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
