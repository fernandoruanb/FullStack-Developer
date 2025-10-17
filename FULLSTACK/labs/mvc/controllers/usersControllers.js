const userModels = require("../models/userModels.js");

exports.getHomePage = (req, res) => {
	const users = userModels.getAllUsers();
	res.render("users", { users });
}

exports.addUser = (req, res) => {
	const { name, age } = req.body;
	console.log(req.body)
	// Protect because it cannot be safe

	if (!name || !age ) {
		return res.status(400).send("Name and age are required!");
	}

	// Call the database to add the data

	userModels.addUser(name, age);

	res.render("success", { name, age });
}

exports.getUserForm = (req, res) => {
	res.render("add", {});
}