const path = require("path");
const transporter = require(path.join(__dirname, "../config/email.js"));

exports.sendEmail = async (receiver, content, webPage) => {
        try {
		if (!receiver || !content || !webPage)
			throw new Error("MISSING_INPUT");
		await transporter.verify();
                console.log("Successfully connected to email server");
                const email = await transporter.sendMail({
                        from: `Your life coach todoApp :) <${process.env.EMAIL_GMAIL_USER}>`,
                        to: receiver,
                        subject: content,
                        html: webPage
                });
		/*console.log("Email:", receiver);
		console.log("Content:", content);
		console.log("webPage:", webPage);
		console.log("Message ID:", email.messageId);
		console.log("Response:", email.response);*/
                console.log("Email sent successfully");
		return (true);
        } catch (err) {
                console.error("Error sending email:", err.message);
		return (false);
        }
};

