// Array of numbers
const numbers = [1, 2, 3, 4, 5];
console.log("Original numbers:", numbers);

// If you want to double each number, you can use an arrow function with map to do it
const doubled = numbers.map(num => num * 2);
console.log("Doubled:", doubled);

// If you want to filter the results, you can do it use the filter
const filter = numbers.filter(num => num > 3);
console.log("Filtered:", filter);

// Acumulute values and return it
const reduce = numbers.reduce((acumulator, value) => {
	return (acumulator + value);
});
console.log("Reduced:", reduce);
