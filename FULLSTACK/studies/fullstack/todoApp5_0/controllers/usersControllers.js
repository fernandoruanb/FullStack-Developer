const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js" ));
const jwt = require("jsonwebtoken"); // It is necessary to configurate JWT and you need cookie-parser and dotenv

// Login

exports.updateUserTask = async (req, res) => {
	if (!req.body || !req.body.oldTask || !req.body.newTask)
		return res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { newTask, oldTask } = req.body;
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const id = decoded.todo_id;
		if (!id)
			throw new Error("NO_AUTH");
		const todo_id = parseInt(id[0][0].id, 10);

		console.log("ID NA UPDATE:", user_id, typeof user_id);

		if (typeof todo_id !== "number" || typeof oldTask !== "string" || typeof newTask !== "string")
			throw new Error("INVALID_INPUT");

		await usersModel.updateUserTodoTask(todo_id, oldTask, newTask);

		return res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.buttonUpdateTask = async (req, res) => {
	if (!req.params.task)
		return res.status(400).json({ error: "1MISSING_INPUT" });
	try {
		const { task } = req.params;

		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;

		if (typeof user !== "string" || typeof task !== "string")
			throw new Error("INVALID_INPUT");

		console.log("User: ", user, "Task: ", task);
		return res.render("getUserTask", { user, task } );
	} catch (err) {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.buttonDeleteTask = async (req, res) => {
	if (!req.body || !req.body.task)
		res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { task } = req.body;

		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = decoded.user;

		await usersModel.deleteUserTask(user, task);

		res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.deleteUserById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id)
			return res.status(400).json({ error: "MISSING_PARAMS" });

		const parseId = parseInt(id, 10);
		if (isNaN(parseId))
			throw new Error("FAILED_PARSING_ID");
		const rows = await usersModel.deleteUserById(parseId);

		// You can see everything here
		return res.status(200).json(rows);
		//res.redirect("/getDashBoard");

	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

exports.getDashBoard = async (req, res) => {
	const token = req.cookies.token;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;

		const tasks = await usersModel.getUserTasks(user);

		return res.render("dashboard", { user, tasks });
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
}

exports.login = async (req, res) => {
	if (!req.body || !req.body.email || !req.body.password)
		return res.status(400).json({ error: "MISSING_INPUT" });
	
	try {
		const { email, password } = req.body;

		await usersModel.tryLogin(email, password);

		const user = await usersModel.getLoginUsername(email);

		const user_id = await usersModel.getUsersId(user);
		const todo_id = await usersModel.getTodoId(user);

		if (!user_id || !todo_id)
			throw new Error("INVALID_IDS");

		// Useful data === payload
		const payload = { email, user, user_id, todo_id };

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

		return res.redirect("getDashBoard");
	} catch (err) {
		let success = null;
		const message = "Invalid credentials";
		return res.render("loginPage", { success, message } );
	}
};

exports.addTodoTaskPage = (req, res) => {
	res.render("addNewTask", {} );
};

exports.addTodoTask = async (req, res) => {
	if (!req.body || !req.body.task)
		return res.status(400).json({ error: "MISSING_INPUT " });
	try {
		const { task } = req.body;

		if (typeof task !== "string")
			return res.status(400).json({ error: "INVALID_INPUT" });
		
		const token = req.cookies.token;

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;
		const user_id = decoded.user_id;
		const uid = parseInt(user_id[0][0].id, 10);

		await usersModel.addTodoNewTask(uid, user, task);

		res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.register = async (req, res) => {
	if (!req.body || !req.body.username || !req.body.password || !req.body.email || !req.body.confirmPassword)
		return res.status(400).json({ error: "MISSING_INPUT" });

	try {
		const { username, password, email, confirmPassword } = req.body;

		if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string" || typeof confirmPassword !== "string")
			return res.status(400).json({ error: "INVALID_INPUT" });
	
		let user = null;

		if (password !== confirmPassword)
			throw new Error("PASSWORD_MISMATCH");

		// Registering the user
		await usersModel.registerUser(username, password, email);
		// Registering the user's todo
		await usersModel.addUser(username, "It's your first task :)");
		const success = "Registered successfully!";

		return res.redirect("loginPage", { success });
	} catch (err) {
		let message = null;

		if (err.message === "PASSWORD_MISMATCH")
			message = "Password Mismatch";
		else if (err.code === "ER_DUP_ENTRY")
			message = "The user already exists";
		else
			message = err;
			//message = "A problem happened, try again";
		return res.render("register", { message });
	}
};

exports.loginPage = (req, res) => {
	const message = null;
	const success = null;
	res.render("loginPage", { message, success } );
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
