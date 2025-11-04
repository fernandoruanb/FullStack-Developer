const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");

/*
	cb -> callback
	path.extname -> extract the extension of the file
	null -> without an error
*/

exports.uploadMiddleware = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.join(__dirname, "../assets/uploads/avatars"));
		},
		filename: (req, file, cb) => {
			try {
				const token = req.cookies.token;
				if (!token)
					return cb(new Error("NO_AUTH"));
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				const user_id = decoded.user_id;
				// I chose .tmp extension to avoid conflicts. It is only the temporary file
				cb(null, `avatar_${user_id}.tmp`);
			} catch (err) {
				cb(err);
			}
		}
	}),
		limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
		fileFilter: (req, file, cb) => {
			const allowed = ["image/jpeg", "image/png", "image/webp" ];
			if (!allowed.includes(file.mimetype)) // checking the extension is allowed
				return cb(new Error("INVALID_FILE_TYPE"));
			cb(null, true);
		},
});
