const express = require("express");
const path = require("path");
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));
const router = express.Router();

// Forgot Password

router.get("/forgotPasswordPage", usersControllers.forgotPasswordPage);

router.post("/getEmailValidateCheck", usersControllers.getEmailValidateCheck);

router.get("/verifyForgotPasswordCode", usersControllers.getCodeValidate);

router.post("/checkCode", usersControllers.checkCode);

router.get("/newPassword", usersControllers.newPassword);

router.post("/recoverPassword", usersControllers.recoverPassword);

//Get method login

router.get("/login", usersControllers.loginPage);

router.get("/register", usersControllers.signUpPage);

// Post method login

router.post("/register", usersControllers.register);

router.post("/login", usersControllers.login);

module.exports = router;
