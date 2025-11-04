const jwt = require("jsonwebtoken");
const path = require("path");
const usersModel = require(path.join(__dirname, "../models/usersModel.js"));

/* The structure of a middleware is req for request, res for response and next. Next can be another middleware
 or the route
*/

exports.requireAuth = async (req, res, next) => {
	// Get a cookie named "token"
	const token = req.cookies.token;

	if (!token)
		return (res.redirect("/login"));

	// That decodification can capture expiration time and the user must login again to get a new cookie
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next(); // if you pass an error here, we can call immediately the middleware of error
	} catch (err) {
		if (err.name === "TokenExpiredError")
		{
			const decoded = jwt.decode(token);
			const user_id = decoded.user_id;
			await usersMode.setIsOnline("0", user_id);
			console.error("TOKEN_EXPIRED_ERROR");
		}
		else
			console.error("AUTH_ERROR:", err.message);
		return res.redirect("/login");
	}
}
