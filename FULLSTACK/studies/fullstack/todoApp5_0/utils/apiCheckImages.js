const axios = require("axios");

// Axios is a HTTP library to do requests in external APIs using a simple and powerful way.

exports.checkImageSafety = async (imageUrl) => {
	try {
		const response = await axios.get("https://api.sightengine.com/1.0/check.json", {
			params: {
				url: imageUrl,
				models: "nudity-2.0,wad,offensive,violence",
				api_user: process.env.SIGHTENGINE_USER,
				api_secret: process.env.SIGHTENGINE_SECRET
			},
		});

		const data = response.data;

	const raw = data.nudity?.raw ?? 0; //total nudity
	const partial = data.nudity?.partial ?? 0; // partial nudity
	const safe = data.nudity?.safe ?? 1; // safety scale

		const nsfw = raw > 0.1 ||
			     partial > 0.2 ||
			     safe < 0.9 ||
			     data.offensive?.prob > 0.3 ||
		     	     data.violence?.prob > 0.3 ||
		     	     data.weapon?.prob > 0.3 ||
		             data.alcohol?.prob > 0.3 ||
		             data.drugs?.prob > 0.3;

		return { nsfw, details: data };
	} catch (err) {
		console.error("Sightengine API error:", err.message);
		return ( { nsfw: false, details: { error: err.message } });
	}
}
