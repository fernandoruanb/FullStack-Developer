const http = require("http");

const server = http.createServer((req, res) => {
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(`
			<h2>Cadastro de usuário</h2>
			<form action="submit" method="POST">
				<label>Nome</label><br><br>
				<input type="name" required><br>
				<label>Email</label><br><br>
				<input type="email" required><br>
				<button type="submit">Enviar</button>
			</form>
		`);
	} else {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Not Found 404!");
	}
});

server.listen(3000, () => {
	console.log("Servidor aberto e escutando na porta principal");
});
