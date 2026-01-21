
const express = require("express");
const cors = require("cors");
const aboutRoutes = require("./routes/about.routes");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger());

app.use("/api", aboutRoutes);

app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };
