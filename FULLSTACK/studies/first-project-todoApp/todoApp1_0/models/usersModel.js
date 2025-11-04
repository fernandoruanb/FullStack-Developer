let task = [];

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
