const path = require("path");
const initDatabase = require(path.join(__dirname, "./dbInit.js"));

// create connection with database and test connection

let db = null;

function getDB() {
	return (db);
}

async function initializeAndConnect() {
	try {
		db = await initDatabase();
		console.log("MySQL Connected!");
	} catch (err) {
		console.error("Error initializing database: ", err);
		process.exit(1);
	}
};

// export the database module

module.exports = {
	initializeAndConnect,
	getDB
};
