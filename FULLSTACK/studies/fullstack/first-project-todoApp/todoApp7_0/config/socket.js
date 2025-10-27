module.exports = (io) => {
	// socket is the individual channel between the client and the server
	// First event called if detect a new client 
	io.on("connection", (socket) => {
		console.log("New client appeared", socket.id);

		// on -> listen
		socket.on("chat message", (msg) => {
			// send with emit for everyone socket.emit is only for that client
			io.emit("chat message", msg);
		});

		socket.on("disconnect", () => {
			console.log("The client left", socket.id);
		});
	});
};
