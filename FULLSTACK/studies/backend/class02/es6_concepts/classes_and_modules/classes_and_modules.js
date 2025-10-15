// Simple class example

class Person {
	constructor(name) {
		this.name = name;
	}
	
	sayHello() {
		console.log(`Hello, my name is ${this.name}`);
	}
}

const person1 = new Person("Fernando");
person1.sayHello();

class secondPerson {
	constructor (name, age) {
		Object.assign(this, { name, age }); // to avoid using this a lot
	}
	
	sayHello() {
		console.log(`Hello, my name is ${this.name} and my age is ${this.age}`);
	}
}

const person = new secondPerson("Fernando", 24);
person.sayHello();

const person2 = new secondPerson("Larissa", 25);
person2.sayHello();

// to get functions from other classes

class Student extends Person {
	constructor(name, grade) {
		super(name); // we use super to call the constructor of extended class
		this.grade = grade;
	}

	showGrade() {
		console.log(`${this.name} is in grade ${this.grade}`);
	}
}

const student = new Student("Fernando", 125);
student.sayHello();
student.showGrade();

// using static methods

class Car {
	constructor(name, price) {
		Object.assign(this, { name, price });
	}

	showCar() {
		console.log(`That is the car ${this.name} and the price is US$${this.price}`);
	}

	static comparePrices(c1, c2) {
		if (c1.price > c2.price)
			return (`${c1.name} is more expensive than ${c2.name}`);
		else if (c1.price < c2.price)
			return (`${c1.name} is more cheap than ${c2.name}`);
		else
			return (`${c1.name} costs the same as ${c2.name}`);
	}
}

const car1 = new Car("Skyline", 90000);
const car2 = new Car("Mustang", 80000);

console.log(Car.comparePrices(car1, car2));

class Rectangle {
	constructor(width, height) {
		Object.assign(this, { width, height });
	}

	// That organization is necessary, I tried to do without them and I failed :)	
	getWidth() {
		return (this.width);
	}

	getHeight() {
		return (this.height);
	}

	setWidth(width) {
		this.width = width;
	}

	setHeight(height) {
		this.height = height;
	}
}

const rec1 = new Rectangle(2, 4);
console.log(rec1.getWidth(), rec1.getHeight());
rec1.setWidth(10)
rec1.setHeight(12);
console.log(rec1.getWidth(), rec1.getHeight());

// Private elements of the class in Javascript

class Account {
	constructor() {}; // It works without that constructor too because Javascript can create implicitily one

	#balance = 0;

	deposit(amount) {
		if (amount > 0)
			this.#balance += amount;
		else
			console.log("Deposit must be positive");
	}

	getBalance() {
		return this.#balance;
	}
}

const bank = new Account(); // You can also use here only Account without brackets, but it is recommended brackets
bank.deposit(100);
bank.getBalance();

// Polimorphism

class Animal {
	constructor() {};

	speak() {
		console.log("The animal makes a sound");
	}
}

class Dog extends Animal {
	constructor() {
		super(); // It is notnecessary, but only for knowledge
	}
	speak() {
		console.log("Woof!");
	}
}

const animal = new Animal();
animal.speak();

const dog = new Dog();
dog.speak();
