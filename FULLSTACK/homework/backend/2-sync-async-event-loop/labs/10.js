console.log("Started");

function task(duration, name, signal = false) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (signal === false)
				reject(`Promise ${name} rejected`);
			else 
				resolve(`Promise ${name} accepted`);
		});
	});
}

async function execute() {
	try {
		const winner = await Promise.any([
			task(1000, "task 1", false),
			task(1000, "task 2", false),
			task(1000, "task 3", true)
		]);
		console.log("Winner:", winner);
	} catch (err) {
		console.error("Something wrong happened", err);
	} finally {
		console.log("Finnaly done");
	}
}

execute();

console.log("Finished");
