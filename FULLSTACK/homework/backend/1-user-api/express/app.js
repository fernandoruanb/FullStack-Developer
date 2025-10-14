const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
	res.send(`
		<h2>Cadastro de Usuário</h2>
		<form action="/submit" method="POST">
		<label>Nome:</label><br>
		<input type="text" name="name" required><br><br>
		<label>Email:</label><br>
		<input type="email" name="email" required><br><br>
		<button type="submit">Submit</button>
		</form>
	`);
});

app.post("/submit", (req, res) => {
	const { name, email } = req.body;

	res.send(`
		<p><strong>Name:</strong>${name}</p>
		<p><strong>Email:</strong>${email}</p>
		<a href="/">Voltar</a>
	`);
});

app.listen(3000, () => {
	console.log("Servidor Express rodando em http://localhost:3000");
});
