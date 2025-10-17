let task = [];

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}
