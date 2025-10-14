const [, , a, b] = process.argv; //node archive.js 2 3 (ignoring the first and the second arguments)
const sum = Number(a) + Number(b);
console.log(`a + b = ${sum}`);

const [program, file , num1, num2] = process.argv;
console.log(`The argv is: ${program}, ${file}, ${num1}, ${num2}`);
