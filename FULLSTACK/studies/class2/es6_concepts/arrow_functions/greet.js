function greet(name) {
	console.log(`Hello ${name}`);
}

const greeting = (name) => {
	console.log(`Hello ${name}`);
}

((name) => {
	console.log(`Hello ${name}`);	
})("Fernando");

greet("Fernando");
greeting("Fernando");
