console.log("Start");

setTimeout(() => {
	console.log("Task 1 completed");

	setTimeout(() => {
		console.log("Task 2 completed");

		setTimeout(() => {
			console.log("Task 3 completed");
			console.log("All steps finalized");
		}, 1000);

	}, 1000);

}, 1000);

console.log("Finished");
