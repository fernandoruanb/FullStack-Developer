const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const usersControllers = require(path.join(__dirname, "./controllers/usersControllers.js"));

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true })); // middleware of express that allows to parse the url

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", usersControllers.getHomePage);

app.post("/add", usersControllers.addUser);

// Error middleware

app.use(((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
}));

app.listen(PORT, () => {
	console.log(`Server is running in http://localhost:${PORT}`);
});
