const path = require('path');
const app = require(path.join(__dirname, './app.js'));
const dotenv = require('dotenv');
const { getDB, initializeAndConnect } = require(path.join(__dirname, "./config/dbConnection.js"));

// Configure environment variables

dotenv.config();

// Get the port from the .env file or set 5000 as a default

const PORT = process.env.PORT || 5000;

(async () => {
	try {
		await initializeAndConnect();
		const db = getDB();

		// Starting to listen from the specified PORT

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});

	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
})();
