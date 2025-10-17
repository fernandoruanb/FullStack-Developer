let task = [];
const path = require("path");
const db = require(path.join(__dirname, "../config/db.js"));

exports.dbTest = () => {
	db.query("SELECT * FROM todos");
};

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
