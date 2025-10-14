// Using template string to interpolate everything that we need
const name = "Alice";
const age = 25;

console.log(`My name is ${name} and I am ${age} years old.`);

// Creating expressions with template string

const x = 10;
const y = 5;

console.log(typeof x, typeof y); // we can use the keyword typeof to see the type of the variable
console.log(`${x} + ${y} = ${x + y}`);

// We can avoid to use multiple newlines with template strings

const myName = "Fernando Ruan";
const profession = "Fullstack Developer";

console.log(`
	Hello, everyone, my name is ${myName}
	and I am here studying to become a ${profession}
	nice to meet you all :)
`);

// We can also use a template string as a return of a function

function greet(user) {
	return (`
		Hello ${user.name}, You are learning ${user.language}
	`);
}

const greeting = greet({ name: "Fernando", language: "Javascript" });
console.log(greeting);

// Formatted stdout

const products = [
	{ name: "Book", price: 20 },
	{ name: "Pen", price: 5 }
];

console.log(`${products[0].name} costs ${products[0].price}
${products[1].name} costs ${products[1].price}
`);

// Using dynamic HTML with template strings

function createCard(title, content) {
	return(`
<div class="card">
	<h2>Title</h2>
	<p>Content</p>
</div>`
	);
}

const card = createCard("FullStackDeveloper", "Fernando");
console.log(card);
