const path = require("path");
const { validationResult, body } = require("express-validator");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex=/^[a-zA-Z0-9._-]+$/; 

const { checkUsernameSafety } = require(path.join(__dirname, "../utils/apiCheckUsername.js"));

// bad-words check for username and user

const Filter = require("bad-words"); // with commonJS support
const filter = new Filter();

/*

	That is our central of validations. Every validation in body, parameters and queries can be centralized
here perfectly to avoid repeat a lot of times the same validations

*/

exports.validatorMiddleware = [
	// Validate images and more I prefer to use utils functions, works better
	// trim removes spaces, tabs, etc

	body("password")
	  .optional()
	  .trim()
	  .isLength({ min: 8 })
          .withMessage("Password must have at least 8 characters")
	  .matches(passwordRegex)
	  .withMessage("Password must contain upper, lower, number and special character"),

	body("username")
	  .optional()
	  .trim()
	  .isLength({ min: 3 })
	  .withMessage("Username must have at least 3 characters")
	  .custom(async (value) => {
		const result = await checkUsernameSafety(value);
		if (result.nsfw)
			throw new Error("Innapropiate or profane username API detected!");
		console.log(result.nsfw);
		console.log(result.error);
		console.log("Deu certo para:", value, "data: ", result.data);
		return true;
	  })
	  .custom(value => {
		if (filter.isProfane(value)) {
		   throw new Error("Inappropriate or profane username");
	  	}
		return true;
	  })
	  .matches(usernameRegex)
	  .withMessage("Username can only contain letters, numbers, dots, underscores or hyphens"),

	body("user")
	  .optional()
	  .trim()
	  .isLength({ min: 3 })
	  .withMessage("User must have at least 3 characters")
	  .custom(async (value) => {
                const result = await checkUsernameSafety(value);
                if (result.nsfw)
                        throw new Error("Innapropiate or profane username API detected!");
		console.log(result.nsfw);
                console.log(result.data);
                return true;
          })
	  .custom(value => {
		if (filter.isProfane(value)) {
		   throw new Error("Innapropriate or profane user");
		}
		return true;
	  }) 
	  .matches(usernameRegex)
	  .withMessage("User can only contain letters, numbers, dots, underscoreso or hyphens"),

	body("email")
	  .optional()
	  .trim()
	  .matches(emailRegex)
	  .withMessage("The email must have the correct syntax of a normal email")
];

exports.validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	let success = null;
	let message = null;

	const currentPath = req.path; // the route

	if (!errors.isEmpty()) {
		message = errors.array().map(err => err.msg);
		if (currentPath === "/register")
			return res.render("register", { message });
		else if (currentPath === "/login") {
			message = "Email/Password incorrect";
			return res.render("loginPage", { message, success }); // the second needs to be an object
		}
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
