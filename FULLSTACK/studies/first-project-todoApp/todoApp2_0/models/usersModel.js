let task = [];
const path = require("path");

// Get the database

const { getDB } = require(path.join(__dirname, "../config/dbConnection.js"));

exports.searchUser = async (user) => {
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_FAILED");
	if (typeof user !== "string")
		throw new Error("INVALID_INPUT");
	const [ rows ] = await db.query(`SELECT * FROM todo WHERE user = ?`, [user]);
	return (rows);
};

exports.deleteUser = async (user) => {
	const db = getDB();

	if (!db)
		throw new Error("DATABASE_FAILED");
	if (typeof user !== "string")
		throw new Error("INVALID_INPUT");

	await db.query(`DELETE FROM todo WHERE user = ?`, [user]);
};

exports.dbAllUsers = async () => {
	try {
		const db = getDB();
		if (!db)
			throw new Error("DATABASE_FAILED");

		const [ rows ] = await db.query("SELECT * FROM todo");
		return (rows);

	} catch (err) {
		console.error("Database query error get: ", err);
		throw new Error(`DATABASE_QUERY_ERROR: ${err.message || err}`);
	}
};

exports.addUser = async (name, task) => {
	if (!name || !task)
		throw new Error("MISSING_INPUT");

	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_EXISTS");

	await db.query("INSERT INTO todo (user, task) VALUES (?, ?)", [name, task]);
}

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
