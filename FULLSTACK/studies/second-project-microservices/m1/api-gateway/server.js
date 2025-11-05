import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/hello", async (req, res) => {
	try {
		const response = await axios.get("http://product-service:3002/hello");
		res.send(`API Gateway - ${response.data}`);
	} catch (err) {
		res.status(500).send("Error connecting to Product Service");
	}
});

// The API needs to listen in all interface

app.listen(PORT, "0.0.0.0", () => {
	console.log(`API/Gateway running on port ${PORT}`);
});
