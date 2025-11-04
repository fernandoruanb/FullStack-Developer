const axios = require("axios"); // to communicate with external APIs
//const FormData = require("form-data"); // to create a formularie to send

// mode style of validation

// To send text, we need to use the internal module URLSearchParams

exports.checkUsernameSafety = async (username) => {
	try {
		// ml for machine learning and rules for normal wordlist
		// ml returns scores and rules return list matches
		// ml ignores categories, rules needs categories

		if (!username || !username.trim() || typeof username !== "string")
			return ({ nsfw: false, data: null, error: "EMPTY_USERNAME" });
		const params = new URLSearchParams({
			text: username,
			lang: "en",
			mode: "ml",
			api_user: process.env.SIGHTENGINE_USER,
			api_secret: process.env.SIGHTENGINE_SECRET
		});

		// form.getHeaders generate a boundary to identify the HTTP header and separate from other data

		const response = await axios.post(
			"https://api.sightengine.com/1.0/text/check.json",
			params,
			{ headers: { "Content-Type" : "application/x-www-form-urlencoded" } }
		);

		const result = response.data;
		const classes = result.moderation_classes || {};

		// some method is useful to detect if at least one item satisfy the condition

		const nsfw = (classes.sexual || 0) > 0.3 ||
			     (classes.discriminatory || 0) > 0.3 ||
			     (classes.insulting || 0) > 0.3 ||
			     (classes.violent || 0) > 0.3 ||
			     (classes.toxic || 0) > 0.3;
			 
		return ({ nsfw, data: response.data });
	} catch (err) {
		return ({ nsfw: false, data: null, error: err.message });
	}
}
