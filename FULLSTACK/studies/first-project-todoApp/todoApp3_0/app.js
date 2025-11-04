const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "./controllers/usersControllers.js"));

// authentication middleware to handle user sessions
const { requireAuth } = require(path.join(__dirname, "./middlewares/authMiddleware.js"));

// Separating private and public routes
const privateRoutes = require(path.join(__dirname, "./routes/privateRoutes.js"));
const publicRoutes = require(path.join(__dirname, "./routes/publicRoutes.js"));

// Building our cookies
const cookieParser = require("cookie-parser");

// Starting our web application using Express as a framework
const app = express();

app.set("view engine", "ejs"); // using an ejs for training server-side rendering
app.set("views", path.join(__dirname, "./views"));

app.use(express.urlencoded({ extended: true })); // We need it to capture the data from HTML formularies
app.use(express.json()); // If we need to use JSON, the permission needs to be give to Express

app.use(cookieParser()); // It is necessary to read cookies

// PublicRoutes
app.use("/", publicRoutes);

app.use(requireAuth);

app.use("/", privateRoutes);

module.exports = app;
