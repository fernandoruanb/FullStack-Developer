// Implicit return
const add = (a, b) => a + b;

// Explicit return
const returnAdd = (a, b) => {
	return (a + b);
}

let result;

result = add(2, 3);
console.log("First example of add:", result); 
result = returnAdd(2, 3);
console.log("Second example of add with return:", result);
