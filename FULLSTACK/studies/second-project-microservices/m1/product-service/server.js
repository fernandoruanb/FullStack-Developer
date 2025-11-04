import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;

app.get("/hello", (req, res) => {
	res.send("Hello from Product Service, the best of the world =D");
});

app.listen(PORT, () => {
	console.log(`Product Service running on port ${PORT}`);
});
