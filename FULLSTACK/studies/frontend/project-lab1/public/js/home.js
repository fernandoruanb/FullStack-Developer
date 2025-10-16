const taskList = document.getElementById(listOfTasks);

const tasks = usersModel.getTasks();

taskList.innerHTML = "";

taskList.forEach(tasks => {
    const li = document.createElement("li");
    li.textContent = tasks;
    taskList.appendChild(li);
});