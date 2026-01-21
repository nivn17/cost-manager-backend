const express = require("express");
const cors = require("cors");
const aboutRoutes = require("./routes/about.routes");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

const app = express();

/* Express App Setup
 * ---------------------------------------------------------------------------
 * - cors(): allow cross-origin requests (front-end can access API).
 * - express.json(): parse JSON request bodies.
 * - requestLogger(): log every HTTP request to MongoDB (logs collection).
 */

// Enable CORS for all routes.
app.use(cors());

// Parse JSON bodies (required for POST /api/add endpoints in other services).
app.use(express.json());

// Log every request after response finishes.
app.use(requestLogger());

/*
 * Routes Mounting
 * ---------------------------------------------------------------------------
 * This service exposes admin "about" endpoint(s) under "/api".
 * Example (per requirements): GET /api/about
 */

// Mount routes defined in about.routes.js
app.use("/api", aboutRoutes);

/*
 * 404 Handler
 * ---------------------------------------------------------------------------
 * Requirements: error JSON should include at least { id, message }.
 * Here we return a consistent error response when no route matched.
 */
app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
