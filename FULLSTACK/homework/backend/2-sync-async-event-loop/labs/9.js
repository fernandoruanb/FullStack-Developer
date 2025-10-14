console.log("Start");

function task(duration, name, signal = false) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (signal === false)
				reject(`Promise ${name} rejected`);
			else {
				console.log(`Promise ${name} accepted`);
				resolve(name);
			}
		});
	});
}

async function execute() {
	try {
		const winner = await Promise.race([
			task(1000, "task 1", true),
			task(1000, "task 2", true),
			task(1000, "task 3", false)
		]);
		console.log("Winner:", winner);
	} catch (err) {
		console.error("Something wrong happened: ", err);
	} finally {
		console.log("Execute finished");
	}
}

execute();

console.log("Finished");
