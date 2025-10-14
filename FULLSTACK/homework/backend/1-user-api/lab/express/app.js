const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true })); // It is a parser to interpreter HTML code

app.get("/", (req, res) => {
	res.send(`
		<h2>New User Formularie</h2>
		<form action="/submit" method="post">
		<label>Name:</label><br>
		<input type="text" name="name" required></input><br><br>
		<label>Email:</label><br>
		<input type="email" name="email" required></input><br><br>
		<button type="submit">Submit</button>
		</form>
	`);
});

app.post("/submit", (req, res) => {
	const { name, email } = req.body;

	res.send(`
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>Email:</strong> ${email}</p>
		<a href="/">Main Page</p>
	`);
});

app.listen(3000, () => {
	console.log("The server is running on http://localhost:3000");
});
