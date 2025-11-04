const express = require("express");
const router = express.Router();
const path = require("path");
const usersControllers = require(path.join(__dirname, "../controllers/usersControllers.js"));

// Captcha

router.get("/getCaptcha", usersControllers.getCaptcha);

module.exports = router;
