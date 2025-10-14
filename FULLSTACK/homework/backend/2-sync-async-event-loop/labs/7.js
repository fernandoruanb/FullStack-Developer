console.log("Start");

function task(duration, name, signal = false) {
	return new Promise((resolve, reject) => {
	setTimeout(() => {
		if (signal === false) {
			reject(`ERROR ABORTING THE SYSTEM!!!`);
		} else {
			console.log(`${name} succeed`);
			resolve();
		}
	}, duration);
});
}

async function execute() {
	try {
		await task(1000, "Task 1", true);
		await task(1000, "Task 2", true);
		await task(1000, "Task 3", false);
		console.log("Everything done");
	} catch (err) {
		console.error("Something wrong was captured", err);
	} finally {
		console.log("The final of function reached");
	}
}

execute();

console.log("Finished");
