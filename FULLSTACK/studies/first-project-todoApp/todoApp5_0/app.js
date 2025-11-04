const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "./controllers/usersControllers.js"));

// Central of validations (global)

const { validatorMiddleware, validateRequest } = require(path.join(__dirname, "./middlewares/validatorMiddleware.js"));

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

// We need to give the folder assets as static to web browser can find images

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(validatorMiddleware);

app.use(validateRequest);

// PublicRoutes
app.use("/", publicRoutes);

app.use(requireAuth);

app.use("/", privateRoutes);

// Not found route

app.use((req, res, next) => {
	return res.render("notFound");
});

// Error middleware

app.use((err, req, res, next) => {
	const statusCode = err.status || 500;
	res.status(statusCode).json({ message: err.message || "INTERNAL_SERVER_ERROR" });
});

module.exports = app;
