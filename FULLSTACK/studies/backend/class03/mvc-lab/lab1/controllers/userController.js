const userModel = require("../models/userModel"); // we can see it as a database
const path = require("path");

// In that first example, we did not use the userModel, to simulate our database

exports.getHomePage = (req, res) => {
	const users = userModel.getAllUsers();
	res.sendFile(path.join(__dirname, "../views/users.html")); // we sent directly the file on view
};
