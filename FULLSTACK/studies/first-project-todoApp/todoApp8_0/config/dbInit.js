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
			tasks_finished INT DEFAULT 0,
			tasks_progressing INT DEFAULT 0,
		  	status ENUM('pending', 'done') DEFAULT 'pending',
		  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	     	)
	 `);
		// Authentication profile
		// TEXT NULL and never TEXT DEFAULT NULL

		await connection.query(`
			CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR(100) UNIQUE NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			avatar VARCHAR(255) DEFAULT 'assets/images/default.jpg',
			isValidEmail BOOLEAN DEFAULT FALSE,
			description TEXT NULL,
			friends INT DEFAULT 0,
			isOnline BOOLEAN DEFAULT FALSE,
			twoFactorEnable BOOLEAN DEFAULT FALSE,
			twoFactorSecret VARCHAR(100) DEFAULT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
		`);

		// Channels, ON UPDATE CURRENT_TIMESTAMP to update automatically that column

		await connection.query(`
			CREATE TABLE IF NOT EXISTS channels (
			id INT AUTO_INCREMENT PRIMARY KEY,
			content TEXT NOT NULL,
			sender_id INT NOT NULL,
			receiver_id INT NULL DEFAULT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
		`);

		await connection.query(`
			CREATE TABLE IF NOT EXISTS chats (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
		`);

		await connection.query(`
			CREATE TABLE IF NOT EXISTS friends (
			id INT AUTO_INCREMENT PRIMARY KEY,
			owner_id INT NOT NULL,
			friend_id INT NOT NULL,
			accepted BOOLEAN DEFAULT FALSE,
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
