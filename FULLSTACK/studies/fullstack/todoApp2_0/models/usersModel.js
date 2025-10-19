let task = [];
const path = require("path");

// Get the database
const { getDB }= require(path.join(__dirname, "../config/dbConnection.js"));

exports.dbTest = async (req, res) => {
	try {
		const db = getDB();
		if (!db)
			return res.status(500).json({ error: "Database not initialized" });
	

	const [ rows ] = await db.query("SELECT * FROM todo");
	res.json(rows);
	} catch (err) {
		console.error("Database query error get: ", err);
		res.status(500).json({ error: err.message });
	}
};

exports.addUser = async (req, res) => {
	if (!req.body || !req.body.name || !req.body.task)
		return res.status(400).send("MISSING_INPUT");
	const { name, task } = req.body;
	const db = getDB();
	if (!db)
		return res.status(500).send("Bad database connection");
	await db.query("INSERT INTO todo (user, task) VALUES (?, ?)", [name, task]);
	res.render("newUser", { name, task });
}

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
