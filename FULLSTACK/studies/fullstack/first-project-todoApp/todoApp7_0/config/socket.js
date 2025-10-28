const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

module.exports = (io) => {
	// socket is the individual channel between the client and the server
	// First event called if detect a new client 
	const users = new Map();
	let messages = [];

	(async () => {
		try {
			messages = await usersModel.getAllChannelsMessages();
			console.log("got all messages");
		} catch (err) {
			console.error(err);
		}
	})();

	io.on("connection", (socket) => {
		socket.on("join", (user) => {
			const name = user?.trim();
			users.set(socket.id, name);

			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: arrived to that room`);
			io.emit("sendMessage", messages);
		});

		socket.on("sendMessage", async (user, message) => {
			if (!user)
				user = "anonymous";
			const name = user?.trim();
			const powered = `${name}: ${message}`;
			try {	
				if (message) {
					messages.push(powered);
					io.emit("sendMessage", messages);
					const user_id = await usersModel.getUsersId(user);
					await usersModel.storeMessages(user_id, powered);
				}
			} catch (err) {
				console.error(err.message);
			}
		});

		socket.on("disconnect", () => {
			const name = users.get(socket.id);
			users.delete(socket.id);

			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: left from the room`);
		});
	});
};
