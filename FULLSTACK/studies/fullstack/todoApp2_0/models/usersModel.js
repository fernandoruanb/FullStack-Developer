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

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
