const readline = require("node:readline");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("What is your name? ", (name) => {
	rl.question("How old are you? ", (age) => {
		console.log(`Your name is ${name} and you are ${age} years old`);
		rl.close();
	});
});
