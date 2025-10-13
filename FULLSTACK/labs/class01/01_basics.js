console.log("Hello, World");

var a = 50; // redeclarável e reatribuível
let b = 30; // não redeclarável, mas reatribuível
const c = 40;  // nem redeclara nem reatribui

console.log("O valor de A: ", a);
console.log("O valor de B: ", b);
console.log("O valor de C: ", c);

var a = 540;

console.log("O valor de A: ", a);

a = 42;

console.log("O valor de novo de A é: ", a);
//let b = 23; não permite ser redeclarado

b = 40;
console.log("O valor novo de B: ", b);

//const c = 42; // Vai dar error
//c = 42;

// Não podemos nem redeclarar o const e nem modificar o valor interno dele.
