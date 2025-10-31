const path = require("path");
const transporter = require(path.join(__dirname, "../config/email.js"));

exports.sendEmail = async (receiver, content, webPage) => {
        try {
                const email = await transporter.sendMail({
                        from: `Your life coach todoApp :), <${process.env.EMAIL_USER}>`,
                        to: receiver,
                        subject: content,
                        html: webPage
                });
                console.log("Email sent successfully");
		return (true);
        } catch (err) {
                console.error("Error sending email:", err.message);
		return (false);
        }
};

