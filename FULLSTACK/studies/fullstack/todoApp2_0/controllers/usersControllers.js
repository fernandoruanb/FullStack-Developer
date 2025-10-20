const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

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
	res.render("deleteForm", {});
};

// Get all users in Database

exports.getAllUsers = async (req, res) => {
	try {
		const [ rows ] = await usersModel.dbAllUsers();
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
	
	await usersModel.userAdd(name, task);

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

// Send the delete formularie

exports.deleteForm = (req, res) => {
	res.render("deleteForm", {} );
};

// Add the new task to our database

exports.addTodo = (req, res) => {
	if (!req.body || !req.body.task)
		return (res.status(400).send("You need to inform a task"));

	const task = req.body.task;

	usersModel.addNewTask(task);

	return (res.render("success", { task } ));
};
