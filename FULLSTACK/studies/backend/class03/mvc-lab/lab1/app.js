const express = require("express");
const path = require("path");
const userController = require("./controllers/userController");

const app = express();
const PORT = 3000;

app.get("/", userController.getHomePage);

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

