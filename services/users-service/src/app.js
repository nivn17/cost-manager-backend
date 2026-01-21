const express = require("express");
const cors = require("cors");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

// Routes for this service:
// - addRoutes: POST /api/add (add new user)  [per requirements]
// - usersRoutes: GET /api/users and GET /api/users/:id (user list and details)
const addRoutes = require("./routes/add.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

/*
 * Express App Setup
 * ---------------------------------------------------------------------------
 * - cors(): allow cross-origin requests.
 * - express.json(): parse JSON request bodies.
 * - requestLogger(): save log entry in MongoDB per every HTTP request.
 */
app.use(cors());
app.use(express.json());
app.use(requestLogger());

/*
 * Routes Mounting
 * ---------------------------------------------------------------------------
 * All endpoints are mounted under "/api".
 */
app.use("/api", addRoutes);
app.use("/api", usersRoutes);

// Fallback route for unknown endpoints (standard error JSON).
app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
