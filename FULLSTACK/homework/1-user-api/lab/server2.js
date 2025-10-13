const http = require("http");

const server = http.createServer((req, res) => {
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(`
			<h2>New User Formularie</h2>
			<form action="/submit" method="POST">
			<label>Nome</label><br>
			<input type="text" name="name" required><br><br>
			<label>Email:</label><br>
			<input type="email" name="email" required><br><br>
			<button type="submit">Submit</button>
			</form>
		`);
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not Found 404");
	}
});

server.listen(3000, () => {
	console.log("Servidor rodando em http://localhost:3000");
});
