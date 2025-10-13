console.log("Start");

setTimeout(() => {
	console.log("Task 1 (3000ms)");
}, 3000);

setTimeout(() => {
	console.log("Task 2 (1000ms)");
}, 1000);

setTimeout(() => {
	console.log("Task 3 (0ms)");
});

console.log("Finished");
