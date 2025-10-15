// Spread operator
const fruits = ["apple", "banana", "orange"];
console.log(fruits);

const moreFruits = [...fruits, "watermelow"];
console.log(moreFruits);

// Concatenate arrays with spread

const odd = [1, 3, 5];
const even = [2, 4, 6];

const both = [...odd, ...even];
console.log("Both: ", both);

// Spread in objects 

const user = { name: "Alice", age: 25 };
const localization = { city: "Tokyo" };

const newLocal = { ...user, ...localization };
console.log(newLocal);

// Properties to rewrite

const base = { id: 1, name: "Bob" };
const update = { name: "Richard" };

const merged = { ...base, ...update };
console.log(merged);

// function with rest

function sum(...numbers) {
	let result = 0;
	for ( let num of numbers ) {
		result += num;
	}
	return (result);
}

console.log(sum(2, 3, 6));

// Combining destructuring with rest

const [first, ...others] = ["a", "b", "c", "d"];

console.log(first); // get only the first value
console.log(others); // get all the others

// extracting a specif value to a variable and all the other to another one

const person = { name: "Maria", age: 30, city: "Paris" };

const { name, ...details } = person;
console.log(details);

// merge objects

function mergeUsers(user1, user2, ...others) {
	return {
		...user1,
		...user2,
		others
	};
}

console.log(mergeUsers(
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Pedro" },
	{ id: 3, name: "Larissa" }
));

