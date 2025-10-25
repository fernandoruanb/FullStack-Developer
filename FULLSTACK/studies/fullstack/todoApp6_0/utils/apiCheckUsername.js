const axios = require("axios"); // to communicate with external APIs
const FormData = require("form-data"); // to create a formularie to send

// mode style of validation

exports.checkUsernameSafety = async (username) => {
	try {

		if (!username || !username.trim() || typeof username !== "string")
			return ({ nsfw: false, data: null, error: "EMPTY_USERNAME" });
		const form = new FormData();
		form.append("text", username);
		form.append("api_user", process.env.SIGHTENGINE_USER);
		form.append("api_secret", process.env.SIGHTENGINE_SECRET);
		form.append("mode", "rules");
		form.append("lang", "en");
		form.append("categories", "profanity,personal,link,drug,weapon,violence,self-harm,extremism");

		// form.getHeaders generate a boundary to identify the HTTP header and separate from other data

		const response = await axios.post(
			"https://api.sightengine.com/1.0/text/check.json",
			form,
			{ headers: form.getHeaders() }
		);

		const result = response.data;
		console.log(result);

		const categories = [
      			"profanity",
      			"personal",
      			"link",
      			"drug",
      			"weapon",
      			"violence",
      			"self-harm",
      			"extremism",
    	];

		// some method is useful to detect if at least one item satisfy the condition

		const nsfw = categories.some((cat) => Array.isArray(result[cat]?.matches) && result[cat].matches.length > 0);
		return ({ nsfw, data: response.data });
	} catch (err) {
		return ({ nsfw: false, data: null, error: err.message });
	}
}
