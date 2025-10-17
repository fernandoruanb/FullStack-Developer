const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

exports.getTodoApp = (req, res) => {
	const tasks = usersModel.getTasks();
	res.render("home", { tasks } );
};

exports.getForm = (req, res) => {
	res.render("taskForm", {} );
};

exports.addTodo = (req, res) => {
	if (!req.body || !req.body.task)
		return (res.status(400).send("You need to inform a task"));

	const task = req.body.task;

	usersModel.addNewTask(task);

	return (res.render("success", { task } ));
};
