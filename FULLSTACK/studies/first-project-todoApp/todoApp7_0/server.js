const path = require('path');
const app = require(path.join(__dirname, './app.js'));
const dotenv = require('dotenv');
const { getDB, initializeAndConnect } = require(path.join(__dirname, "./config/dbConnection.js"));
const http = require("http");
const { Server } = require("socket.io");
const registerServer = require(path.join(__dirname, "./config/socket.js"));

// Configure environment variables

dotenv.config();

// Get the port from the .env file or set 5000 as a default

const PORT = process.env.PORT || 5000;

(async () => {
	try {
		await initializeAndConnect();
		const db = getDB();
		// server based in our framework Express here
		const server = http.createServer(app);
		// Socket can listen and emit data
		const io = new Server(server);
		// Register each event to handle with socket
		registerServer(io);

		app.set("io", io);

		// Starting to listen from the specified PORT

		server.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});

	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
})();
