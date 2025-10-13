let n = 5;
const timer = setInterval(() => {
	console.log("Counter: ", n);
	if (--n === 0) {
		clearInterval(timer);
		setTimeout(() => console.log("timeout!"), 1000);
	}
}, 1000);
