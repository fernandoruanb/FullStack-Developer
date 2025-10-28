const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

module.exports = (io) => {

	// socket is the individual channel between the client and the server
	// First event called if detect a new client 

	const users = new Map();
	let messages = [];
	let allChannels = ["General"];

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
			//socket.join("General");

			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: arrived to that room`);
			io.emit("sendMessage", messages);
		});

		socket.on("joinChannel", async ({ user, roomName }) => {
			const room = roomName?.trim();
			if (!room) return ;
			socket.join(room);
			console.log(`${user} joined to ${room}`);

			io.to(room).emit("system", `${user} arrived to ${room}`);
		});

		socket.on("leaveChannel", async ({ user, roomName }) => {
			const room = roomName?.trim();
			if (!room) return ;
			socket.leave(room);
			console.log(`${user} left ${room}`);

			io.to(room).emit("system", `${user} left ${room}`);
		});

		socket.on("sendMessage", async (user, message) => {
			if (!user)
				user = "anonymous";
			const name = user?.trim();
			const powered = `${name}: ${message}`;
			try {
				if (message) {
					messages.push(powered);
					//io.to(roomName || "General").emit("sendMessage", messages);
					io.emit("sendMessage", messages);
					const user_id = await usersModel.getUsersId(user);
					await usersModel.storeMessages(user_id, powered);
				}
			} catch (err) {
				console.error(err.message);
			}
		});

		socket.on("createChannel", async (newChannel) => {
			const nameChannel = newChannel?.trim();
			allChannels.push(nameChannel);
		});

		socket.on("deleteChannel", async (targetChannel) => {
			const nameChannel = targetChannel?.trim();
			allChannels = allChannels.filter(channels => channels !== nameChannel);
		});

		socket.on("disconnect", () => {
			const name = users.get(socket.id);
			users.delete(socket.id);

			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: left from the room`);
		});
	});
};
