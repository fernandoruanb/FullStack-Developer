const express = require("express");
const path = require("path");
const userControllers = require ("./controllers/userControllers.js");

const PORT = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", userControllers.getHomePage);

app.listen(PORT, () => console.log(`The server is running on http://localhost:${PORT}`));
