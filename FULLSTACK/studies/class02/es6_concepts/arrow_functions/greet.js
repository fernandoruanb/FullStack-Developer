// normal function
function greet(name) {
	console.log(`Hello ${name}`);
}

// arrow function
const greeting = (name) => {
	console.log(`Hello ${name}`);
}

// arrow function simplified

const newGreeting = (name) => console.log(`Hello ${name}`);

// Define and autoexecute arrow function

((name) => {
	console.log(`Hello ${name}`);	
})("Fernando anonymous arrow function");

newGreeting("Fernando newGreeting");
greet("Fernando greet");
greeting("Fernando greeting");
