const user = {
	name: "Kirlia",
	arrowFunction: function() {
		setTimeout(() => {
			console.log(`The Pokemon's arrow name is ${this.name}`);
		}, 1000);
	},
	traditionalFunction: function() {
		setTimeout(function() {
			console.log(`The Pokemon's traditional name is ${this.name}`);
		}, 1000);
	}
}

const obj = {
	name: "Fernando",
	arrow: () => console.log(`${this.name}`),
	normal() { 
		console.log(`${this.name}`); 
	}
}
user.arrowFunction();
user.traditionalFunction();

obj.arrow();
obj.normal();
