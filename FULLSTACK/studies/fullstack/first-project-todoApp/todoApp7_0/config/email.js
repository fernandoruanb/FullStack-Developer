const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "in-v3.mailjet.com",
	port: 465,
	secure: true, // SSL
	auth: {
		user: process.env.EMAIL_MAILJET_USER,
		pass: process.env.EMAIL_MAILJET_PASS
	}
});

module.exports = transporter;		
