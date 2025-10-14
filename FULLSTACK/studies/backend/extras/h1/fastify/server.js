const fastify = require("fastify");
const formbody = require("@fastify/formbody");

const app = fastify();

app.register(formbody);

app.get("/", (request, response) => {
	response.code(200).header("Content-Type", "text/html; charset=utf-8").send(`
		<h2>Cadastro de Usuário</h2>
		<form action="/submit" method="POST">
		<label>Nome</label><br>
		<input type="text" name="nome" required><br><br>
		<label>Email</label><br><br>
		<input type="email" name="email" required><br><br>
		<button type="submit">Submit</button>
	`);
});

app.post("/submit", (request, response) => {
	const { nome, email } = request.body;

	if (!nome || !email) {
		response.code(400).header("Content-Type", "text/plain; charset=utf-8").send(`Faltou mais detalhes`);
		process.exit(1);
	}
	response.code(200).header("Content-Type", "text/html; charset=utf-8").send(`
		<h2>Dados Recebidos</h2>
		<p><strong>Nome:</strong> ${nome}</p>
		<p><strong>Email:</strong> ${email}</p>
		<a href="/">Voltar</a>
	`);
});

app.listen({ port: 3000 }, () => {
	console.log("Servidor rodando em http://localhost:3000");
});
