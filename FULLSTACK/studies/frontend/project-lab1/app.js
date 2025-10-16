const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "./controllers/usersControllers.js"));
const routes = require(path.join(__dirname, "./routes/routes.js"))
const app = express();

app.set("view engine", "ejs"); // using an ejs for training server-side rendering
app.set("views", path.join(__dirname, "./views"));

app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

module.exports = app;
