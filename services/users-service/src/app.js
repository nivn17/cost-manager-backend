const express = require("express");
const cors = require("cors");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorJson } = require("./common/errors");

const addRoutes = require("./routes/add.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger());

app.use("/api", addRoutes);
app.use("/api", usersRoutes);

app.use((req, res) => res.status(404).json(errorJson(4040, "Not Found")));

module.exports = { app };

