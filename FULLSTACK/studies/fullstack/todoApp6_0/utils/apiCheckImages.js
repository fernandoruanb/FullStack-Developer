const axios = require("axios"); // to communicate with external APIs
const fs = require("fs"); // to read files, write...
const FormData = require("form-data"); // to create a formularie to send

// Axios is a HTTP library to do requests in external APIs using a simple and powerful way.

exports.checkImageSafety = async (localPath) => {
	try {
		const form = new FormData();
		form.append("media", fs.createReadStream(localPath));
		form.append("models", "nudity-2.1,wad,offensive,violence,type");
		form.append("api_user", process.env.SIGHTENGINE_USER);
		form.append("api_secret", process.env.SIGHTENGINE_SECRET);

		const response = await axios.post("https://api.sightengine.com/1.0/check.json",form, {
			headers: form.getHeaders()
		});

		// The imageUrl needs to be public accessible on Internet to use GET method
		// Substitute localPath for imageUrl just for a better understanding if use GET method
		/*const response = await axios.get("https://api.sightengine.com/1.0/check.json", {
			params: {
				url: imageUrl,
				models: "nudity-2.1,wad,offensive,violence",
				api_user: process.env.SIGHTENGINE_USER,
				api_secret: process.env.SIGHTENGINE_SECRET
			},
		});*/

		const data = response.data;

		const nsfw = data.nudity?.erotica > 0.2 ||
  			data.nudity?.sexual_activity > 0.02 ||
 			data.nudity?.sexual_display > 0.02 ||
			data.nudity?.very_suggestive > 0.4 ||
  			data.nudity?.suggestive > 0.5 ||
  			data.nudity?.mildly_suggestive > 0.6 ||
  			data.violence?.prob > 0.3 ||
  			data.weapon > 0.3 ||
  			data.alcohol > 0.3 ||
  			data.drugs > 0.3;

		//console.log("nsfw:", nsfw, "data:", data);
		return { nsfw, details: data };
	} catch (err) {
		console.error("Sightengine API error:", err.message);
		return ( { nsfw: false, details: { error: err.message } });
	}
}
