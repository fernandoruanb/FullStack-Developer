const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const db = require(path.join(__dirname, "../config/dbConnection.js"));

//Get method login

router.get("/login", usersControllers.loginPage);

router.get("/register", usersControllers.signUpPage);

// Post method login

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

module.exports = router;
