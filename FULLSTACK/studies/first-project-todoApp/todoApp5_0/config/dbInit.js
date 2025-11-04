const path = require("path");
const db = require("mysql2/promise");

// create Database

async function initDatabase() {
	let connection = null;

	try {
		connection = await db.createConnection({
			host: "localhost",
			user: "root",
			password: "rootpassword"
		});
	
		await connection.query("CREATE DATABASE IF NOT EXISTS todoDb");
		await connection.query("USE todoDb");

		// Todo's profile

		await connection.query(`
			CREATE TABLE IF NOT EXISTS todo (
		  	todo_id INT AUTO_INCREMENT PRIMARY KEY,
			id INT DEFAULT NULL,
		  	task VARCHAR(255) NOT NULL,
		  	status ENUM('pending', 'done') DEFAULT 'pending',
		  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	     	)
	 `);
		// Authentication profile

		await connection.query(`
			CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR(100) UNIQUE NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			avatar VARCHAR(255) DEFAULT 'assets/images/default.jpg',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
		`);

	} catch (err) {
		console.error("Error initializing the database: ", err);
		process.exit(1);
	}
	console.log("Database and table are ready");
	return (connection);
}

module.exports = initDatabase;
