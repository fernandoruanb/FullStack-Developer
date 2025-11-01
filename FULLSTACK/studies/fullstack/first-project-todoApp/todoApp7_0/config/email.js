const nodemailer = require("nodemailer");

require("dotenv").config();

//console.log("USER:", process.env.EMAIL_GMAIL_USER);
//console.log("PASS:", process.env.EMAIL_GMAIL_PASS);

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // SSL
	auth: {
		user: process.env.EMAIL_GMAIL_USER,
		pass: process.env.EMAIL_GMAIL_PASS
	}
});

module.exports = transporter;	
