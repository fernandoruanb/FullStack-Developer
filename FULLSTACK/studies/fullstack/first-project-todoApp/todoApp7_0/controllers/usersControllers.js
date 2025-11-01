const path = require("path");
const fs = require("node:fs/promises");
const usersModel = require(path.join(__dirname, "../models/usersModel.js" ));
const jwt = require("jsonwebtoken"); // It is necessary to configurate JWT and you need cookie-parser and dotenv
const sharp = require("sharp"); // to edit the image
const { checkImageSafety } = require(path.join(__dirname, "../utils/apiCheckImages.js"));
const svgCaptcha = require("svg-captcha");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { sendEmail } = require(path.join(__dirname, "../utils/sendEmail.js"));

exports.verifyConfirmationCode = async (req, res) => {
	let message = [];
	let success = [];
	try {
		if (!req.body || !req.body.code)
			throw new Error("MISSING_INPUT");
		const { code } = req.body;
		if (typeof code !== "string")
			throw new Error("INVALID_INPUT");
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user_id = decoded.user_id;
		if (code === req.session.captcha) {
			await usersModel.confirmTheEmail(user_id);
			success.push("E-mail confirmed successfully");
			return res.render("loginPage", { message, success });
		}
		else {
			message.push("Incorrect e-mail validation, try again");
			return res.render("loginPage", { message, success });
		}
	} catch (err) {
		console.error("Something wrong happened when we were checking the confirmation code");
		return res.status(500).json({ error: err.message });
	}
};

exports.sendConfirmationEmail = async (req, res) => {
	try {
		let message = [];
		let success = [];
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const email = decoded.email;
		const user = decoded.user;

		const captcha = svgCaptcha.create({
                	size: 8,
                	noise: 4,
                	color: true,
                	background: "#f4f4f4"
        	});

		if (!email || !user)
			throw new Error("MISSING_INPUT");

       	 	req.session.captcha = captcha.text;
		req.session.captchaExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

		const subject = "Confirmation of e-mail";
		const content = captcha.text;
		const webPage = `
			<h2>TodoApp Confirmation E-mail</h2>
			<p>Hello, your code is ${content}</p>
			<p>Please, inform it to confirm this account</p>
		`;
		await sendEmail(email, subject, webPage);
		return res.render("getConfirmationCode", { user });
	} catch (err) {
		console.error("Error sending the confirmation email");
		return res.status(500).json({ error: err.message });
	}
};

exports.deleteEverything = async (req, res) => {
	try {
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user_id = decoded.user_id;
		const user = decoded.user;

		if (!user || !user_id)
			throw new Error("NO_AUTH");

		const avatarPublic = await usersModel.getAvatar(user_id);
		const avatar = path.join(__dirname, "..", avatarPublic);

		await usersModel.deleteEverything(user_id);

		if (avatarPublic !== "assets/images/default.jpg")
			await fs.unlink(avatar);

		const isProduction = process.env.NODE_ENV === "production";

		res.clearCookie("token", {
                	httpOnly: true,
                	sameSite: "lax",
                	secure: isProduction,
                	path: "/"
        	});
        	res.redirect("/login");
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.showUserProfile = async (req, res) => {
	try {
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user_id = decoded.user_id;
		const user = decoded.user;
		const avatar = await usersModel.getAvatar(user_id);
		res.render("profile", { user, avatar });
	} catch (err) {
		return res.status(500).json({ error: err.message });	
	}
};

exports.postChangeUsername = async (req, res) => {
        if (!req.body || !req.body.username)
                return res.status(400).json({ error: "MISSING_INPUT" });

        let success = null;
        let message = [];
        let user_id = null;
        let user = null;
	let email = null;
	const io = req.app.get("io");

        try {
                const { username } = req.body;
                const token = req.cookies.token;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.user_id;
                user = decoded.user;
		email = decoded.email;

                await usersModel.updateUsername(username, user_id);
		user = username;

		const payload = { user, user_id, email };
		const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN || "1h"
                });

                const safeCookie = process.env.NODE_ENV === "production";

                // Lax === relaxed in English, strict for more security 
                // Extra security, localhost needs secure false or the cookie will not send to browser
                // httpOnly protects your cookies to avoid accessing from browser javascript, avoiding XSS attacks

                res.cookie("token", newToken, {
                        httpOnly: true,
                        secure: safeCookie,
                        sameSite: "lax",
                        maxAge: 60 * 60 * 1000 // 1h in miliseconds
                });

                success = "Username updated successfully";
		io.emit("updateUsername");
                return res.render("changeUsername", { message, success, user } );
        } catch (err) {
                message.push(err.message);
                return res.render("changeUsername", { message, success, user } );
        }
};

exports.postChangePassword = async (req, res) => {
	if (!req.body || !req.body.password || !req.body.confirmPassword)
		return res.status(400).json({ error: "MISSING_INPUT" });

	let success = null;
	let message = [];
	let user_id = null;
	let user = null;

	try {
		const { password, confirmPassword } = req.body;
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		user_id = decoded.user_id;
		user = decoded.user;

		await usersModel.updatePassword(password, user_id);

		success = "Password updated successfully";
		return res.render("changePassword", { message, success, user } );
	} catch (err) {
		message.push(err.message);
		return res.render("changePassword", { message, success, user } );
	}
};

exports.getChangeUsernamePage = async (req, res) => {
        let message = [];
        let success = null;
        try {
                const token = req.cookies.token;
                if (!token)
                        throw new Error("NO_AUTH");

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = decoded.user;

                res.render("changeUsername", { message, success, user } );
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
};

exports.getChangePasswordPage = async (req, res) => {
	let message = [];
	let success = null;
	try {
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;

		res.render("changePassword", { message, success, user } );
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Login

exports.getChannelsPage = async (req, res) => {
	try {
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;

		return res.render("channels", { user } );
	} catch {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.getCaptcha = async (req, res) => {
	// size -> define the quantity of characters you want
	// noise -> add random lines and curves to difficult the automatic reading
	const captcha = svgCaptcha.create({
		size: 5,
		noise: 3,
		color: true,
		background: "#f4f4f4"
	});
	// Save the text in request session
	req.session.captcha = captcha.text;
	req.session.captchaExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

	// Specif the svg image
	res.set("Content-Type", "image/svg+xml");
	res.status(200).send(captcha.data);
};

exports.uploadAvatar = async (req, res) => {
	let user = null;
	let user_id = null;

	try {
		let avatarFile = null;
		if (!req.file)
			throw new Error("NO_FILE_RECEIVED");
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		user = decoded.user;
		user_id = parseInt(decoded.user_id, 10);

		if (!user || !user_id || typeof user !== "string" || typeof user_id !== "number")
			throw new Error("INVALID_TOKEN_DATA");

		const avatarPath = path.join(__dirname, "../assets/uploads/avatars");
		// path.extname already includes the dot, you don't need to put it again
		avatarFile = path.join(avatarPath, `avatar_${user_id}.png`); // destination file, new file

		/*
			SVG (Scalable Vector Graphics) is used to draws geometry forms as a circle, rectangulers and
	etc

			cx -> horizontal centre position
			cy -> vertical centre position
			r -> ray
			Buffer.from is a mask for binary data
			blend combines the mask with the original image 
			dest-in allows only the new image to input
		*/

		// Check innapropriate images

		const result = await checkImageSafety(req.file.path);
		if (result.nsfw) {
			await fs.unlink(req.file.path);
			throw new Error("Forbidden image");
		}

		await sharp(req.file.path)
			.resize(350, 350)
			.png()
			.composite([{
				input: Buffer.from(
					`<svg><circle cx="175" cy="175" r="175"/></svg>`
				),
				blend: "dest-in"
			}])
			.toFile(avatarFile);

		if (req.file.originalname !== "default.jpg")
			await fs.unlink(req.file.path); // remove temporary file

		const avatarPathDB = `/assets/uploads/avatars/avatar_${user_id}.png`;

		await usersModel.uploadAvatar(user_id, avatarPathDB);

		return res.redirect("/getDashBoard");
	} catch (err) {
		console.error("Avatar upload failed", err);
		if (err.message === "Forbidden image") {
			const { tasks, status } = await usersModel.getUserTasks(user_id);
			let avatar = await usersModel.getUserAvatar(user_id);

			let forbidden = "Innapropriate image detected!!! Be careful choosing images!!!";
			return res.render("dashboard", { user, tasks, status, avatar, forbidden } );
		}
		return res.status(500).json({ error: err.message });
	}	
};

exports.completeUserTask = async (req, res) => {
	if (!req.body || !req.body.task)
		return res.status(400).error({ error: "MISSING_INPUT" });
	try {
		const token = req.cookies.token;

		if (!token)
			throw new Error("NO_AUTH");

		const { task } = req.body;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user_id = decoded.user_id;

		await usersModel.completeTheTask(user_id, task);

		return res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.updateUserTask = async (req, res) => {
	if (!req.body || !req.body.oldTask || !req.body.newTask)
		return res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { newTask, oldTask } = req.body;
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const id = decoded.user_id;
		if (!id)
			throw new Error("NO_AUTH");
		const user_id = parseInt(id, 10);
	
		if (typeof user_id !== "number" || typeof oldTask !== "string" || typeof newTask !== "string")
			throw new Error("INVALID_INPUT");

		await usersModel.updateUserTodoTask(user_id, oldTask, newTask);

		return res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.buttonUpdateTask = async (req, res) => {
	if (!req.params.task)
		return res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { task } = req.params;

		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;

		if (typeof user !== "string" || typeof task !== "string")
			throw new Error("INVALID_INPUT");

		return res.render("getUserTask", { user, task } );
	} catch (err) {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.buttonDeleteTask = async (req, res) => {
	if (!req.body || !req.body.task)
		res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { task } = req.body;

		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user_id = decoded.user_id;

		await usersModel.deleteUserTask(user_id, task);

		res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
	}
};

exports.deleteUserById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id)
			return res.status(400).json({ error: "MISSING_PARAMS" });

		const parseId = parseInt(id, 10);
		if (isNaN(parseId))
			throw new Error("FAILED_PARSING_ID");
		const rows = await usersModel.deleteUserById(parseId);

		// You can see everything here
		return res.status(200).json(rows);
		//res.redirect("/getDashBoard");

	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
};

exports.getDashBoard = async (req, res) => {

	let forbidden = null;
	try {
		const query = req.query;
		if (query !== undefined) {
			forbidden = query.error;
		}
		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = decoded.user;
		const user_id = decoded.user_id;

		const { tasks, status } = await usersModel.getUserTasks(user_id);
		let avatar = await usersModel.getUserAvatar(user_id);

		if (!avatar)
			avatar = 'assets/images/default.jpg';

		return res.render("dashboard", { user, tasks, status, avatar, forbidden });
	} catch (err) {
		return res.status(401).json({ error: err.message });
	}
}

exports.verify2faDirect = async (req, res) => {
	if (!req.body || !req.body.code)
		return res.status(400).json({ error: "MISSING_INPUT" });
	let message = [];
	let success = [];
	let user = null;
	let user_id = null;
	try {
                const { code } = req.body;

                const token = req.cookies.token;
                if (!token)
                        throw new Error("NO_AUTH");
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (!decoded)
                        throw new Error("ERROR_DECODING_TOKEN");

                user = decoded.user;
                user_id = decoded.user_id;

                if (typeof user_id !== "number" || typeof code !== "string")
                        throw new Error("INVALID_INPUT");

                const { twoFactorSecret } = await usersModel.get2fa(user_id);

		if (!twoFactorSecret)
			throw new Error("NO_2FA_DONE");

                // secret -> base32, encoding -> base32, token the code the user gives to us windows 1 30s of tolerance
                const verified = speakeasy.totp.verify({
                        secret: twoFactorSecret,
                        encoding: "base32",
                        token: code,
                        window: 1
                });

                if (!verified) {
                        message.push("Invalid code, try again");
                        console.error("Invalid code");
                        return res.render("loginPage", { message, success });
                }
		return res.redirect("/getDashBoard");
	} catch {
		console.error("Something wrong happened");
		return res.render("loginPage", { message, success });
	}
};

exports.verify2fa = async (req, res) => {
	if (!req.body || !req.body.code || !req.body.qrCodeDataURL)
		return res.status(400).json({ error: "MISSING_INPUT" });

	let message = null;
	let user_id = null;
	let success = null;

	try {

		const { code, qrCodeDataURL } = req.body;

		const token = req.cookies.token;
		if (!token)
			throw new Error("NO_AUTH");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded)
			throw new Error("ERROR_DECODING_TOKEN");

		user = decoded.user;
		user_id = decoded.user_id;

		if (typeof user_id !== "number" || typeof code !== "string")
			throw new Error("INVALID_INPUT");

		const { twoFactorSecret } = await usersModel.get2fa(user_id);

		// secret -> base32, encoding -> base32, token the code the user gives to us windows 1 30s of tolerance
		const verified = speakeasy.totp.verify({
			secret: twoFactorSecret,
			encoding: "base32",
			token: code,
			window: 1
		});

		if (!verified) {
			message = "Invalid code, try again";
			console.error("Invalid code");
			return res.render("2fa", { user, qrCodeDataURL, message });
		}

		return res.redirect("/getDashBoard");
	} catch (err) {
		message = [];
		success = [];
		message.push("An error happened, try again");
		return res.render("loginPage", { message, success });
	}
};

exports.get2faPage = async (req, res) => {

	let message = null;
	let success = null;

	try {
		const token = req.cookies.token;
		if (!token)
			throw new Error("INVALID_TOKEN");

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded)
			throw new Error("INVALID_DECODING");

		const user = decoded.user;
		const user_id = decoded.user_id;
		const secret = speakeasy.generateSecret({ name: `MyApp ${user}` });

		await usersModel.set2faSecret(secret.base32, user_id);

		const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

		//check data
		//console.log("secret:", secret.base32, "qrcodeURL:", qrCodeDataURL);

		return res.render("2fa", { user, qrCodeDataURL, message } );
	} catch (err) {
		message = "Error in two factor authentication, try again";
		return res.render("2fa", { user, message, qrCodeDataURL } );
	}
};

exports.login = async (req, res) => {
	if (!req.body || !req.body.email || !req.body.password || !req.body.captchaInput)
		return res.status(400).json({ error: "MISSING_INPUT" });

	let message = [];
	let success = [];

	try {
		const { email, password, captchaInput } = req.body;

		if (!req.session || captchaInput !== req.session.captcha) {
			message.push("Invalid captcha answer");
			return res.render("loginPage", { message, success });
		};

		await usersModel.tryLogin(email, password);

		const user = await usersModel.getLoginUsername(email);

		const user_id = await usersModel.getUsersId(user);

		if (!user_id)
			throw new Error("INVALID_IDS");

		const { twoFactorEnable, twoFactorSecret } = await usersModel.get2fa(user_id);

		// Useful data === payload
		const payload = { email, user, user_id };

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || "1h"
		});

		const safeCookie = process.env.NODE_ENV === "production";

		// Lax === relaxed in English, strict for more security
		// Extra security, localhost needs secure false or the cookie will not send to browser
		// httpOnly protects your cookies to avoid accessing from browser javascript, avoiding XSS attacks

		res.cookie("token", token, {
			httpOnly: true,
			secure: safeCookie,
			sameSite: "lax", 
			maxAge: 60 * 60 * 1000 // 1h in miliseconds
		});

		const isConfirmedEmail = await usersModel.getIsValidEmail(user_id);
		if (!isConfirmedEmail)
			return res.redirect("/confirmEmail");

		if (twoFactorEnable) {
			if (twoFactorSecret === null) {
				return res.redirect("/2fa");
			}
			message = null;
			return res.render("2fa_after", { user, message });
		}

		return res.redirect("/getDashBoard");
	} catch (err) {
		//const message = "Email/Password incorrect";
		message.push(err);
		return res.render("loginPage", { success, message } );
	}
};

exports.addTodoTaskPage = (req, res) => {
	res.render("addNewTask", {} );
};

exports.addTodoTask = async (req, res) => {
	if (!req.body || !req.body.task)
		return res.status(400).json({ error: "MISSING_INPUT" });
	try {
		const { task } = req.body;

		if (typeof task !== "string")
			return res.status(400).json({ error: "INVALID_INPUT" });
		
		const token = req.cookies.token;

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user_id = decoded.user_id;

		await usersModel.addTodoNewTask(user_id, task);

		res.redirect("/getDashBoard");
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

exports.register = async (req, res) => {
	if (!req.body || !req.body.username || !req.body.password || !req.body.email || !req.body.confirmPassword || !req.body.captchaInput)
		return res.status(400).json({ error: "MISSING_INPUT" });

	let message = [];
        let success = [];

	try {
		// enable2fa -> undefined if the user did not fill the checkbox or string "true" if they did it
		const { username, password, email, confirmPassword, captchaInput, enable2fa } = req.body;

		if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string" || typeof confirmPassword !== "string" || typeof captchaInput !== "string")
			return res.status(400).json({ error: "INVALID_INPUT" });

                if (!req.session || captchaInput !== req.session.captcha) {
			console.error("Invalid captcha answer detected");
                        message = "Invalid captcha answer";
                        return res.render("register", { message });
                };

		let user = null;

		if (password !== confirmPassword)
			throw new Error("PASSWORD_MISMATCH");

		// Registering the user
		await usersModel.registerUser(username, password, email, enable2fa);
		// Registering the user's todo

		const user_id = await usersModel.getUsersId(username);

		await usersModel.addUser(user_id, "It's your first task :)");

		success.push("Registered successfully!");

		return res.render("loginPage", { success, message });
	} catch (err) {

		if (err.message === "PASSWORD_MISMATCH")
			message.push("Password Mismatch");
		else if (err.code === "ER_DUP_ENTRY")
			message.push("The user already exists");
		else
			message.push(err.message);
			//message = "A problem happened, try again";
		return res.render("register", { message });
	}
};

exports.loginPage = (req, res) => {
	const message = [];
	const success = [];
	res.render("loginPage", { message, success } );
};

exports.signUpPage = (req, res) => {
	const message = [];
	res.render("register", { message } );
};

exports.logout = (req, res) => {
	// the logout is only the clean of cookies and go back to login webpage
	const isProduction = process.env.NODE_ENV === "production";

	// If you get an error here, the token will not erase

	// the "path" here indicates the start point of token erase and / indicates all points

	/*
		There is a big problem using sameSite: strict because if you are logging and be redirect to another
		external website like OAuth from Google, the session cookie will not send to backend because the
		strict protection against CSRF. Lax is secure, but not so strong like strict. For natural use of webpage, many websites prefer Lax.
	*/

	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
		secure: isProduction,
		path: "/"
	});
	res.redirect("/login");
}

// Return the user searched

exports.searchUser = async (req, res) => {
	try {
		if (!req.body || !req.body.user)
			return res.status(400).json({ error: "MISSING_INPUT" });

		const { user } = req.body;

		const rows = await usersModel.searchUser(user);

		return res.status(200).json(rows);
	} catch (err) {
		console.error(`DATABASE_ERROR: ${err.message || err}`);
		return res.status(500).json({ error: `DATABASE_QUERY_ERROR: ${err.message || err}` });
	}
}

// Search for a user

exports.searchUseForm = (req, res) => {
	res.render("getUser", {});
}

// Action of deleteUserForm

exports.deleteUserForm = (req, res) => {
	res.render("deleteUser", {});
}

// Delete formularie

exports.deleteForm = (req, res) => {
	// If you forget the brackets, you store the function
	const tasks = usersModel.getTasks();
	res.render("deleteForm", { tasks } );
};

// Get all users in Database

exports.getAllUsers = async (req, res) => {
	try {
		const rows = await usersModel.dbAllUsers();
		res.status(200).json(rows);
	} catch (err) {
		res.status(500).json({ error: err });
	}
}

// Delete a user in database

exports.deleteUser = async (req, res) => {
	try {
		if (!req.body || !req.body.user)
			return res.status(400).send("MISSING_INPUT");
		const { user } = req.body;

		if (typeof user !== "string")
			return res.status(400).send("INVALID_INPUT_TYPE");

		await usersModel.deleteUser(user);

		return res.render("deleteSuccessUser", { user } );
	} catch (err) {
		console.error("Error deleting user:", err);
		return res.status(500).send("INTERNAL_SERVER_ERROR");
	}
}

exports.userAdd = async (req, res) => {
	if (!req.body || !req.body.name || !req.body.task)
		return res.status(400).send("Bad request, forgot the name/task");
	const { name, task } = req.body;
	
	await usersModel.addUser(name, task);

	res.render("newUser", { name, task });
};

exports.userForm = (req, res) => {
	res.render("userForm", {} );
}

// Get the homepage of todo app

exports.getTodoApp = (req, res) => {
	const tasks = usersModel.getTasks();
	res.render("home", { tasks } );
};

// Send the formularie to add a new task

exports.getForm = (req, res) => {
	res.render("taskForm", {} );
};

// Delete the target task

exports.deleteTodo = (req, res) => {
	if (!req.body || !req.body.deleteTask)
		return (res.status(400).send("You need to inform a task to delete"));

	const { deleteTask } = req.body;

	usersModel.deleteTask(deleteTask);

	const tasks = usersModel.getTasks();

	res.render("deleteAction", { deleteTask, tasks });
};

// Add the new task to our database

exports.addTodo = (req, res) => {
	if (!req.body || !req.body.task)
		return (res.status(400).send("You need to inform a task"));

	const task = req.body.task;

	usersModel.addNewTask(task);

	return (res.render("success", { task } ));
};
