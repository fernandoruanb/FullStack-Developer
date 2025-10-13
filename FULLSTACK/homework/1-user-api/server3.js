const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(`
			<h2>Cadastro de usuário</h2>
			<form action="submit" method="POST">
			<label>Name</label><br>
			<input type="text" name="name" required><br><br>
			<label>Email</label><br>
			<input type="email" name="email" required><br><br>
			<button type="submit">Submit</button>
			</form>
		`);
	} else if (req.url === "/submit" && req.method === "POST") {
		let body = "";

		req.on("data", chunk => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const data = querystring.parse(body);
			const name = data.name;
			const email = data.email;

			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(`
				<h2>Dados recebidos</h2>
				<p><strong>Name:</strong>${name}</p>
				<p><strong>Email:</strong>${email}</p>
				<a href="/">Voltar</a>
			`); 
		});
	 } else {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Not found 404");
	}
});

server.listen(3000, () => {
	console.log("O servidor está rodando na porta 3000");
});
