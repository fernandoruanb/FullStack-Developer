import db from "mysql2/promise";

let connection = null;

export async function initDatabase() {

	try {
		connection = await db.createConnection({
			host: "mysql-db",
			user: "micro_user",
			password: "micro_pass",
			database: "products"
		});

		await connection.query(`CREATE TABLE IF NOT EXISTS products (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			price DECIMAL (10,2) NOT NULL,
			store INT DEFAULT 0,
			sold INT DEFAULT 0,
			received_at DATE NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			);
		`);
	} catch (err) {
		console.error("Failed to connect to the database");
		process.exit(1);
	}
	console.log("Connection established successfully");
	return (connection);
}

export function getDB() {
	return connection;
};

