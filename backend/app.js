const express = require("express");
const bodyParser = require("body-parser");

//requiring express
const app = express();

//Loading routes
const userRoutes = require("./src/routes/user");
const absencesRoutes = require("./src/routes/absences");
const agentsRoutes = require("./src/routes/agent");
const reasonsRoutes = require("./src/routes/reason");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Config headers and Cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// re-writing routes
app.use("/api", userRoutes);
app.use("/api", absencesRoutes);
app.use("/api", agentsRoutes);
app.use("/api", reasonsRoutes);
module.exports = app;
