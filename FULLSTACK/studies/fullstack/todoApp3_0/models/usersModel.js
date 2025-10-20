let task = [];
const path = require("path");
const bcrypt = require("bcrypt");

// Get the database

const { getDB } = require(path.join(__dirname, "../config/dbConnection.js"));

exports.registerUser = async (username, password, email) => {
	if (!username || !password || !email)
		throw new Error("MISSING_INPUT");
	if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email))
		throw new Error("INVALID_EMAIL");
	const password_hash = bcrypt.hash(password, 20);
	if (!password_hash)
		throw new Error("ERROR_HASH_PASSWORD");
	await db.query("INSERT INTO users VALUES (?, ?, ?)", [username, password_hash, email]);
	return (true);
};

exports.loginTime = async (user, password) => {
	if (!user || !password)
		throw new Error("MISSING_INPUT");
	if (typeof user !== "string" || typeof password !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT password FROM users WHERE user = ?", [ user ]);
	if (rows.length === 0)
		throw new Error ("NOT_FOUND_USER");
	const match = await bcrypt.compare(rows[0], password_hash);
	if (!match)
		throw new Error ("INVALID_CREDENTIALS");
	return (true);
};

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
