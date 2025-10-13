function juan(name, age = 0) {
	console.log("your name is " + name);
	console.log("your age is " + age);
}

const greeting = (name) => console.log(`hi, ${name}`);
juan("usama");
greeting("fernando");

juan("MacGyver", 35);
greeting("Fernando", "Carlos", "Nicole", "Usama"); // Only Fernando will be useful here

//gretting(); Error (undefined)

const newGretting = (name = "Fernando") => console.log(`hello, ${name}`);

newGretting();

console.log("" || "Fernando"); // || is a logic operator for OR
