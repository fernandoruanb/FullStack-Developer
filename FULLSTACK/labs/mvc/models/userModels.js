let users = [
	{ name: "Fernando", age: 24 }
];

exports.getAllUsers = () => users;

exports.addUser = (name, age) => {
	const newUser = { name, age: parseInt(age, 10) };
	users.push(newUser);
};
