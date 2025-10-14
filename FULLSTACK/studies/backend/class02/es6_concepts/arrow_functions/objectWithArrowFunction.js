const user = {
	name: "Fernando",
	// Traditional functions rewrite this and not conservate the same as the local where they were called
	greetTraditional: function() {
		setTimeout(function() {
			console.log(`Hello traditional to ${this.name}`); // undefined!!!
		}, 1000);
	},
	// Arrow functions keep the this of the same local when they were called
	greetArrow: function() {
		setTimeout(() => {
			console.log(`Hello with arrow function to ${this.name}`);
		}, 1000);
	}
}

user.greetTraditional();
user.greetArrow();
