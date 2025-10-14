const userModel = require("../models/userModel.js");
const path = require("path");

exports.getHomePage = (req, res) => {
	const users = userModel.getAllUsers();
	res.render("users", { users });
};
