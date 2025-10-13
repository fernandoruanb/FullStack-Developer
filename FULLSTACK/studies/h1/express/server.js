const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200).send(`
		<meta charset="utf-8">
		<h2>Cadastro de Usuários</h2>
		<form action="/submit" method="POST">
		<label>Nome:</label><br>
		<input type="text" name="nome" required><br><br>
		<label>Email:</label><br>
		<input type="email" name="email" required><br><br>
		<button type="/submit">Submit</button>
	`);
});

app.post("/submit", (req, res) => {
	const { nome, email } = req.body;

	res.status(200).send(`
		<meta charset="utf-8">
		<h2>Dados recebidos</h2>
		<p><strong>Nome:</strong> ${nome}</p>
		<p><strong>Email:</strong> ${email}</p>
		<a href="/">Voltar</a>
	`);
});

app.listen(3000, () => {
	console.log("O servidor está rodando em http://localhost:3000");
});
