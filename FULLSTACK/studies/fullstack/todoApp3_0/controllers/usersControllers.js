const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));
const jwt = require("jsonwebtoken"); // It is necessary to configurate JWT and you need cookie-parser and dotenv

// Login

exports.login = async (req, res) => {
	if (!req.body || !req.body.email || !req.body.password)
		return res.status(400).json({ error: "MISSING_INPUT" });
	
	try {
		const { email, password } = req.body;

		await usersModel.tryLogin(email, password);

		const user = await usersModel.getLoginUsername(email);

		// Useful data === payload
		const payload = { email, user };

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || "1h"
		});

		const safeCookie = process.env.NODE_ENV === "production";

		// Lax === relaxed in English, strict for more security
		// Extra security, localhost needs secure false or the cookie will not send to browser
		// httpOnly protects your cookies to avoid accessing from browser javascript, avoiding XSS attacks

		res.cookie("token", token, {
			httpOnly: true,
			secure: safeCookie,
			sameSite: "lax", 
			maxAge: 60 * 60 * 1000 // 1h in miliseconds
		});

		return res.render("dashboard", { user });
	} catch (err) {
		const message = "Invalid credentials";
		return res.render("loginPage", { message } );
	}
};

exports.register = async (req, res) => {
	if (!req.body || !req.body.username || !req.body.password || !req.body.email || !req.body.confirmPassword)
		return res.status(400).json({ error: "MISSING_INPUT" });

	try {
		let user = null;
		const { username, password, email, confirmPassword } = req.body;

		if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string" || typeof confirmPassword !== "string")
			return res.status(400).json({ error: "INVALID_INPUT" });
	
		if (password !== confirmPassword)
			throw new Error("PASSWORD_MISMATCH");
		await usersModel.registerUser(username, password, email);

		// To indicate the success of login as well
		user = username;

		// useful data to make a token
		const payload = { email, user };

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || "1h"
		});

		// Secure the cookies to avoid attacks
		// maxAge updates the time of the cookie but, during logout you must not use maxAge and yes path

		const safeToken = process.env.NODE_ENV === "production";
		res.cookie("token", token, {
			httpOnly: true,
			secure: safeToken,
			sameSite: "lax",
			maxAge: 60 * 60 * 1000
		});

		return res.render("dashboard", { user } );
	} catch (err) {
		let message = null;

		if (err.message === "PASSWORD_MISMATCH")
			message = "Password Mismatch";
		else
			message = "A problem happened, try again";
		return res.render("register", { message });
	}
};

exports.loginPage = (req, res) => {
	const message = null;
	res.render("loginPage", { message } );
};

exports.signUpPage = (req, res) => {
	const message = null;
	res.render("register", { message } );
};

exports.logout = (req, res) => {
	// the logout is only the clean of cookies and go back to login webpage
	const isProduction = process.env.NODE_ENV === "production";

	// If you get an error here, the token will not erase

	// the "path" here indicates the start point of token erase and / indicates all points

	/*
		There is a big problem using sameSite: strict because if you are logging and be redirect to another
		external website like OAuth from Google, the session cookie will not send to backend because the
		strict protection against CSRF. Lax is secure, but not so strong like strict. For natural use of webpage, many websites prefer Lax.
	*/

	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
		secure: isProduction,
		path: "/"
	});
	res.redirect("/login");
}

// Return the user searched

exports.searchUser = async (req, res) => {
	try {
		if (!req.body || !req.body.user)
			return res.status(400).json({ error: "MISSING_INPUT" });

		const { user } = req.body;

		const rows = await usersModel.searchUser(user);

		return res.status(200).json(rows);
	} catch (err) {
		console.error(`DATABASE_ERROR: ${err.message || err}`);
		return res.status(500).json({ error: `DATABASE_QUERY_ERROR: ${err.message || err}` });
	}
}

// Search for a user

exports.searchUseForm = (req, res) => {
	res.render("getUser", {});
}

// Action of deleteUserForm

exports.deleteUserForm = (req, res) => {
	res.render("deleteUser", {});
}

// Delete formularie

exports.deleteForm = (req, res) => {
	// If you forget the brackets, you store the function
	const tasks = usersModel.getTasks();
	res.render("deleteForm", { tasks } );
};

// Get all users in Database

exports.getAllUsers = async (req, res) => {
	try {
		const rows = await usersModel.dbAllUsers();
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ error: err });
	}
}

// Delete a user in database

exports.deleteUser = async (req, res) => {
	try {
		if (!req.body || !req.body.user)
			return res.status(400).send("MISSING_INPUT");
		const { user } = req.body;

		if (typeof user !== "string")
			return res.status(400).send("INVALID_INPUT_TYPE");

		await usersModel.deleteUser(user);

		return res.render("deleteSuccessUser", { user } );
	} catch (err) {
		console.error("Error deleting user:", err);
		return res.status(500).send("INTERNAL_SERVER_ERROR");
	}
}

exports.userAdd = async (req, res) => {
	if (!req.body || !req.body.name || !req.body.task)
		return res.status(400).send("Bad request, forgot the name/task");
	const { name, task } = req.body;
	
	await usersModel.addUser(name, task);

	res.render("newUser", { name, task });
};

exports.userForm = (req, res) => {
	res.render("userForm", {} );
}

// Get the homepage of todo app

exports.getTodoApp = (req, res) => {
	const tasks = usersModel.getTasks();
	res.render("home", { tasks } );
};

// Send the formularie to add a new task

exports.getForm = (req, res) => {
	res.render("taskForm", {} );
};

// Delete the target task

exports.deleteTodo = (req, res) => {
	if (!req.body || !req.body.deleteTask)
		return (res.status(400).send("You need to inform a task to delete"));

	const { deleteTask } = req.body;

	usersModel.deleteTask(deleteTask);

	const tasks = usersModel.getTasks();

	res.render("deleteAction", { deleteTask, tasks });
};

// Add the new task to our database

exports.addTodo = (req, res) => {
	if (!req.body || !req.body.task)
		return (res.status(400).send("You need to inform a task"));

	const task = req.body.task;

	usersModel.addNewTask(task);

	return (res.render("success", { task } ));
};
