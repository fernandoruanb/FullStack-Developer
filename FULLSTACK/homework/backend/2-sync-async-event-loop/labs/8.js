console.log("Started");

function task(duration, name, signal = false) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (signal === false)
				reject(`Promise ${name} rejected`);
			else {
				console.log(`Promise ${name} accepted and it will be resolve`);
				resolve();
			}
		});
	});
}

async function execute() {
	try {
		const results = await Promise.all([
			task(1000, "task 1", true),
			task(1000, "task 2", true),
			task(1000, "task 3", false)
		]);
		console.log("Results:", results);
	} catch (err) {
		console.error("Something wrong happened", err);
	} finally {
		console.log("This instruction will appear every time in every occasion");
	}
};

execute();

console.log("Finished");
