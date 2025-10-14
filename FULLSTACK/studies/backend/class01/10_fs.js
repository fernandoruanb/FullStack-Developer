const fs = require("node:fs/promises");

const data = "Hello, World!";

(async () => {
	await fs.writeFile("data.txt", data, "utf8");
	const content = await fs.readFile("data.txt", "utf8");
	console.log(content);
})();
