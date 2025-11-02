const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();

// Forgot Password

//router.get("/forgotPasswordPage", usersControllers.forgotPasswordPage);

//Get method login

router.get("/login", usersControllers.loginPage);

router.get("/register", usersControllers.signUpPage);

// Post method login

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

module.exports = router;
