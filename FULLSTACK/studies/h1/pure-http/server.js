const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
	if (req.url === "/" && req.method === "GET") {
		res.writeHead(200, { "Content-type": "text/html" });
		res.end(`
			<h2>Cadastro de User</h2>
			<form action="/submit" method="POST">
			<label>Nome:</label><br>
			<input type="text" name="nome" required><br><br>
			<label>Email:</label><br>
			<input type="email" name="email" required><br><br>
			<button type="submit">Submit</button>
			</form>
		`);
	} else if (req.url === "/submit" && req.method === "POST") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			console.log(body);
			const data = querystring.parse(body);
			const name = data.nome;
			const email = data.email;

			res.writeHead(200, { "Content-Type": "text/html"});
			res.end(`
				<h2>Dados Recebidos</h2>
				<p><strong>Nome:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<a href="/">Voltar</a>
			`);
		});
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end(`Not Found Page 404`);
	}
});

server.listen(3000, () => {
	console.log("O servidor está rodando em http://localhost:3000");
});
