console.log("Start");

function task(duration, name) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`${name} concluded`);
			resolve();
		}, duration);
	});
}

task(1000, "Task 1")
  .then(() => task(1000, "Task 2"))
  .then(() => task(2000, "Task 3"))
  .then(() => console.log("Everything done"));

console.log("Finished");
