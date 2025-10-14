// Destructuring arrays of strings
const colors = [ "red", "green", "blue" ];

console.log(`First: ${colors[0]}`);
console.log(`Second: ${colors[1]}`);
console.log(`Third: ${colors[2]}`);

//Destructuring arrays of numbers
const numbers = [10, 20, 30, 40];

console.log(`First: ${numbers[0]}`);
console.log(`Second: ${numbers[1]}`);
console.log(`Third: ${numbers[3]}`);

//Destructuring an object
const user = {
	name: "Alice",
	age: 25,
	city: "Tokyo"
}

console.log(`Username: ${user.name}`);
console.log(`Age: ${user.age}`);
console.log(`City: ${user.city}`);

//Destructuring alias of variables

const product = {
	id: 42,
	price: 9.99
}

const productId = product.id;
const productPrice = product.price;

console.log("Id: " + productId);
console.log("Price: $" + productPrice);

// Alignased objects

const person = {
	name: "Bob",
	address: {
		city: "New York",
		zip: 10001
	}
}

console.log(person.name);
console.log(person.address.zip);

//Destructuring in a function

function greet(user) {
	console.log(`Hello ${user.name}, you are ${user.age}`);
}

greet({ name: "Emma", age: 30 });

// Extracting the name of the second user

const users = [
	{ id: 1, name: "Lucas" },
	{ id: 2, name: "Maria" }
];

const obj = users.find(user => user.name === "Maria");
console.log(obj.name);
const { name } = users.find(user => user.name === "Maria");
console.log(name);
console.log(users[1].name); // if you know the position
const result = users.filter(user => user.name === "Maria"); // filter results where the name is Maria
console.log(result[0].name);
