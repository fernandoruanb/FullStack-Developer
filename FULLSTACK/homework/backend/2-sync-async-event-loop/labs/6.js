console.log("Start");

function task(duration, name) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`${name} concluded`);
			resolve();
		}, duration);
	});
}

async function doTask() {
	await task(1000, "Task 1");
	await task(1000, "Task 2");
	await task(1000, "Task 3");
	console.log("Everything done");
}

doTask();

console.log("Finished");


