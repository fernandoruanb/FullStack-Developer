const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

module.exports = (io) => {

	// socket is the individual channel between the client and the server
	// First event called if detect a new client 

	const users = new Map();
	let messages = [];
	let allChannels = [];

	async function reloadEverything () {
		try {
			messages = await usersModel.getAllChannelsMessages();
			allChannels = await usersModel.getAllChats();
			console.log("got all messages");
		} catch (err) {
			console.error(err);
		}
	};

	(async () => {
		await reloadEverything();
	});

	io.on("connection", (socket) => {
		socket.currentChannel = null;
		socket.on("join", (user) => {
			const name = user?.trim();
			users.set(socket.id, name);
			//socket.join("General");

			(async () => {
				await reloadEverything();
			});
			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: arrived to that room`);
			io.emit("sendMessage", messages);
			io.emit("updateChannels", allChannels);
		});

		(async () => {
			try {
				await reloadEverything();
				io.emit("updateUsers", Array.from(users.values()));
				io.emit("sendMessage", messages);
				io.emit("updateChannels", allChannels);
			} catch (err) {
				console.error("Error to restart everything:", err.message);
			}
		})();

		socket.on("createChannel", async (roomName) => {
			const room = roomName?.trim();
			if (!room || allChannels.includes(room)) return ;
			try {
				await usersModel.storeNewChat(room);
			} catch (err) {
				console.error(err.message);
				return ;
			}

			await reloadEverything();
			io.emit("updateChannels", allChannels);
		});

		socket.on("deleteChannel", async (roomName) => {
			const room = roomName?.trim();
			if (!room) return ;
			allChannels = allChannels.filter(channel => channel != roomName);
			await reloadEverything();
			io.emit("sendMessage", messages);
			io.emit("updateChannels", allChannels);
		});

		socket.on("joinChannel", async ({ user, roomName }) => {
			const room = roomName?.trim();
			if (!room) return ;
                        let user_id = await usersModel.getUsersId(user);
			if (socket.currentChannel === room) {
				socket.emit("leaveChannel", { user: user, roomName: room });
				socket.leave(room);

                        	const powered = `system: ${user} left ${room} channel`;
                        	messages.push(powered);

                        	io.emit("sendMessage", messages);
                        	io.to(room).emit("system", `${user} left ${room}`);
				return ;
			}
			socket.join(room);
			console.log(`${user} joined to ${room}`);
			socket.currentChannel = room;
			console.log(socket.currentChannel);
			const powered = `system: ${user} joined ${room} channel`;
			await usersModel.storeMessages(user_id, powered);
			messages.push(powered);

			io.emit("sendMessage", messages);
			io.emit("updateChannels", allChannels);
			io.to(room).emit("system", `${user} arrived to ${room}`);
		});

		socket.on("sendMessage", async (user, message) => {
			if (!user)
				user = "anonymous";
			const name = user?.trim();
			const powered = `${name}: ${message}`;
			try {
				if (message) {
					//messages.push(powered);
					//io.to(roomName || "General").emit("sendMessage", messages);
					const user_id = await usersModel.getUsersId(user);
					const finalMessage = message?.trim();
					await usersModel.storeMessages(user_id, finalMessage);
					await reloadEverything();
					io.emit("sendMessage", messages);
					io.emit("updateChannels", allChannels);
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

		socket.on("disconnect", async () => {
			const name = users.get(socket.id);
			users.delete(socket.id);

			await reloadEverything();
			io.emit("updateUsers", Array.from(users.values()));
			io.emit("serverMessage", `${name}: left from the room`);
		});
	});
};

