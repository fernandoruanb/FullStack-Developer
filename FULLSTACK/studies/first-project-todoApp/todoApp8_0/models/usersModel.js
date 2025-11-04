let task = [];
const path = require("path");
const bcrypt = require("bcrypt");

// Get the database

const { getDB } = require(path.join(__dirname, "../config/dbConnection.js"));
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

exports.friendsSearch = async(user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	// return all ids of friends
	const result = [];
	const [ friends ] = await db.query("SELECT friend_id,accepted FROM friends WHERE owner_id = ?", [ user_id ]);
	if (friends.length === 0)
		return ([]);
	for (const friend of friends) {
		const [ rows ] = await db.query("SELECT username FROM users WHERE id = ?", [ friend.friend_id ]);
		const username = rows.length > 0 ? rows[0].username : null;
		result.push({ username: username, accepted: friend.accepted });
	}
	return (result);
};

exports.sendFriendRequest = async (user_id, username) => {
	if (!user_id || !username)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" || typeof username !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error ("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT id FROM users WHERE username = ? limit 1", [ username ]);
        if (rows.length === 0)
                throw new Error("NOT_FOUND_USER");
        const owner_id = rows[0].id;
	// Only the target can get the request, the owner no, It needs to be accepted
	await db.query("INSERT INTO friends (owner_id, friend_id) VALUES (?, ?)", [ owner_id, user_id ]); 
};

exports.setIsOnline = async (value, user_id) => {
	if (!value || !user_id)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" && (value !== "1" && value !== "2"))
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	let power = false;
	if (value === "1")
		power = true;
	await db.query("UPDATE users SET isOnline = ? WHERE id = ?", [ power, user_id ]);
}

exports.checkEmailExistence = async(email) => {
	if (!email)
		throw new Error("MISSING_INPUT");
	if (typeof email !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT * FROM users WHERE email = ?", [ email ] );
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	return (true);
};

exports.getIsValidEmail = async (user_id) => {
	if (!user_id)
                throw new Error("MISSING_INPUT");
        if (typeof user_id !== "number")
                throw new Error("INVALID_INPUT");
        const db = getDB();
        if (!db)
                throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT isValidEmail FROM users WHERE id = ?", [ user_id ]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	return (Boolean(rows[0].isValidEmail));
}

exports.confirmTheEmail= async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("UPDATE users SET isValidEmail = true WHERE id = ?", [ user_id ]);
	return (true);
};

exports.deleteEverything = async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");

	await db.query("DELETE FROM users WHERE id = ?", [ user_id ]);
	await db.query("DELETE FROM todo WHERE id = ?", [ user_id ]);
	await db.query("DELETE FROM channels WHERE sender_id = ?", [ user_id ]);

	return (true);
};

exports.getAvatar = async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT avatar FROM users WHERE id = ?", [ user_id ]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	const avatar = rows[0].avatar;
	return (avatar);
}

exports.storeNewChat = async (chat) => {
	if (!chat)
		throw new Error("MISSING_INPUT");
	if (typeof chat !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");

	await db.query("INSERT INTO chats (name) VALUES (?)", [ chat ]);
};

exports.getAllChats = async () => {
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT name FROM chats");
	const chats = [];
	if (rows.length > 0) {
		for (const ch of rows)
			chats.push(ch.name);
	}
	return (chats);
};

exports.getUsersUsername = async (user_id) => {
        if (!user_id)
                throw new Error("MISSING_INPUT");
        const db = getDB();
        if (!db)
                throw new Error("INVALID_INPUT");
        const [ rows ] = await db.query("SELECT username FROM users WHERE id = ? limit 1", [ user_id ]);
        if (rows.length === 0)
                throw new Error("NOT_FOUND_USER");
        return (rows[0].username);
};

exports.getAllChannelsMessages = async () => {
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT content, sender_id FROM channels WHERE receiver_id IS NULL");
	const strings = [];
	if (rows.length !== 0) {
		for (const row of rows) {
			let [ rows ] = await db.query("SELECT username FROM users WHERE id = ?", [ row.sender_id ]);
			let user = rows[0].username;
			let fullMessage = `${user}: ${row.content}`;
			strings.push(fullMessage);
		}
	}
	return (strings);
};

exports.storeMessages = async (user_id, message) => {
	if (!message)
		throw new Error("MISSING_INPUT");
	if (typeof message !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("INSERT INTO channels (content, sender_id) VALUES (?, ?)", [ message, user_id ]);
	return (true);
};

exports.uploadAvatar = async (user_id, avatarPath) => {
	if (!user_id || !avatarPath)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" || typeof avatarPath !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("UPDATE users SET avatar = ? WHERE id = ?", [ avatarPath, user_id ]);
	return (true);
};

exports.completeTheTask = async (user_id, task) => {
	if (!user_id || !task)
		throw new Error("MISSING_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const taskStatus = "done";
	await db.query("UPDATE todo SET status = ? WHERE id = ? AND task = ?", [ taskStatus, user_id, task ]);
	return (true);
}

exports.getUsersId = async (user) => {
	if (!user)
		throw new Error("MISSING_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("INVALID_INPUT");
	const [ rows ] = await db.query("SELECT id FROM users WHERE username = ? limit 1", [ user ]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	return (rows[0].id);
}

exports.updateUserTodoTask = async (user_id, oldTask, newTask) => {
	if (!user_id || !oldTask || !newTask)
		throw new Error("!MISSING_INPUT");
	if (typeof user_id !== "number" || typeof oldTask !== "string" || typeof newTask !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("UPDATE todo SET task = ? WHERE id = ? AND task = ?", [ newTask, user_id, oldTask ]);
	return (true);
};

exports.deleteUserTask = async (user_id, task) => {
	if (!user_id || !task)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" || typeof task !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("DELETE FROM todo WHERE id = ? AND task = ?", [ user_id, task ]);
	return (true);
};

exports.getUserAvatar = async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	if (isNaN(user_id))
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT avatar FROM users WHERE id = ?", [ user_id ]);
	if (rows.length === 0)
		throw new Error("USER_NOT_FOUND");
	return (rows[0].avatar || "assets/images/default.jpg");
};

exports.getUserTasks = async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");

	if (typeof user_id !== "number")
		throw new Error("INVALID_INPUT");

	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");

	const [ rows ] = await db.query("SELECT task, status FROM todo WHERE id = ?", [ user_id ]);

	// map to get a list of tasks to avoid the list of objects
	const tasks = rows.map(row => row.task);
	const status = rows.map(row => row.status);

	return { tasks, status };
};

exports.addTodoNewTask = async (user_id, task) => {
	if (!user_id || !task)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" || typeof task !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("NOT_FOUND_DATABASE");
	await db.query("INSERT INTO todo (id, task) VALUES (?, ?)", [ user_id, task ]);
	return (true);
};

exports.deleteUserById = async (id) => {
	if (!id)
		throw new Error("MISSING_INPUT");
	if (typeof id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("DELETE FROM todo WHERE id = ?", [ id ]);

	const [ rows ] = await db.query("SELECT * FROM todo");
	return (rows);
};

exports.getLoginUsername = async (email) => {
	if (!email)
		throw new Error("MISSING_INPUT");
	if (!emailRegex.test(email))
		throw new Error("INVALID_EMAIL");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query(`SELECT username FROM users WHERE email = ?`, [email]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	return (rows[0].username);
};

exports.tryLogin = async (email, password) => {
	if (!email || !password)
		throw new Error("MISSING_INPUT");
	if (typeof email !== "string" || typeof password !== "string")
		throw new Error("INVALID_INPUT");
	if (!emailRegex.test(email))
		throw new Error("INVALID_EMAIL");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query(`SELECT password FROM users WHERE email = ?`, [ email ]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	const match = await bcrypt.compare(password, rows[0].password);
	if (!match)
		throw new Error("INVALID_CREDENTIALS");
	return (true);
};

exports.set2faSecret = async (secret, user_id) => {
	if (!secret || !user_id)
		throw new Error("MISSING_INPUT");
	if (typeof secret !== "string" || typeof user_id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	await db.query("UPDATE users SET twoFactorSecret = ? WHERE id = ?", [ secret, user_id ]);
	return (true);
};

exports.get2fa = async (user_id) => {
	if (!user_id)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT twoFactorEnable, twoFactorSecret FROM users WHERE id = ?", [user_id]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND");

	const twoFactorEnable = rows[0].twoFactorEnable;
	const twoFactorSecret = rows[0].twoFactorSecret;

	return ({ twoFactorEnable, twoFactorSecret });
};

exports.updateUsername = async (username, user_id) => {
        if (!user_id || !username)
                throw new Error("MISSING_INPUT");
        if (typeof user_id !== "number" || typeof username !== "string")
                throw new Error("INVALID_INPUT");
        const db = getDB();
        if (!db)
                throw new Error("DATABASE_NOT_FOUND");
        const [ rows ] = await db.query("SELECT username FROM users WHERE username = ?", [ username ]);
        if (rows.length !== 0)
                throw new Error("That new username is not disponible");
        await db.query("UPDATE users SET username = ? WHERE id = ?", [ username, user_id ]);
        return (true);
};

exports.recoverPassword = async (password, email) => {
        if (!email || !password)
                throw new Error("MISSING_INPUT");
        if (typeof email !== "string" || typeof password !== "string")
                throw new Error("INVALID_INPUT");
        const db = getDB();
        if (!db)
                throw new Error("DATABASE_NOT_FOUND");
        const [ rows ] = await db.query("SELECT password FROM users WHERE email = ?", [ email ]);
        if (rows.length === 0)
                throw new Error("NOT_FOUND_USER");
        const oldPassword = rows[0].password;
	if (!oldPassword)
		throw new Error("ERROR_GETTING_OLDPASSWORD");
        const match = await bcrypt.compare(password, oldPassword);
        if (match)
                throw new Error("SAME_PASSWORD");
        const newPassword = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password = ? WHERE email = ?", [ newPassword, email ]);
        return (true);
};

exports.updatePassword = async (password, user_id) => {
	if (!user_id || !password)
		throw new Error("MISSING_INPUT");
	if (typeof user_id !== "number" || typeof password !== "string")
		throw new Error("INVALID_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT password FROM users WHERE id = ?", [ user_id ]);
	if (rows.length === 0)
		throw new Error("NOT_FOUND_USER");
	const oldPassword = rows[0].password;
	if (!oldPassword)
		throw new Error("ERROR_GETTING_OLDPASSWORD");
	const match = await bcrypt.compare(password, oldPassword);
	if (match)
		throw new Error("SAME_PASSWORD");
	const newPassword = await bcrypt.hash(password, 10);
	await db.query("UPDATE users SET password = ? WHERE id = ?", [ newPassword, user_id ]);
	return (true);
};

exports.registerUser = async (username, password, email, enable2fa) => {
	if (!username || !password || !email)
		throw new Error("MISSING_INPUT");
	if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string")
		throw new Error("INVALID_INPUT");
	// true or false directly
	enable2fa = enable2fa === "true";
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	if (!emailRegex.test(email))
		throw new Error("INVALID_EMAIL");
	const password_hash = await bcrypt.hash(password, 10);
	if (!password_hash)
		throw new Error("ERROR_HASH_PASSWORD");
	await db.query("INSERT INTO users (username, password, email, twoFactorEnable) VALUES (?, ?, ?, ?)", [username, password_hash, email, enable2fa]);
	return (true);
};

exports.allUsersList = async () => {
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_FOUND");
	const [ rows ] = await db.query("SELECT username,avatar,description,isOnline FROM users ORDER BY username ASC");
	return (rows);
}

exports.getProfileUser = async (user) => {
        console.log("Get profile: ",user);
        if (!user) 
                throw new Error("MISSING_INPUT");
        const db = getDB();
        if (!db)
                throw new Error("DATABASE_FAILED");
        if (typeof user !== "string")
                throw new Error("INVALID_INPUT");
        const [ rows ] = await db.query(`SELECT username,avatar,description,friends,isOnline FROM users WHERE username = ?`, [ user ]);
	console.log(rows[0]);
        return (rows[0] || null);
};

exports.searchUser = async (user) => {
	console.log(user);
	if (!user)
		throw new Error("MISSING_INPUT");
	const db = getDB();
	if (!db)
		throw new Error("DATABASE_FAILED");
	if (typeof user !== "string")
		throw new Error("INVALID_INPUT");
	const [ rows ] = await db.query(`SELECT username,avatar,description,friends FROM users WHERE username LIKE ?`, [ `%${user}%` ]);
	return (rows);
};

exports.deleteUser = async (user) => {
	const db = getDB();

	if (!db)
		throw new Error("DATABASE_FAILED");
	if (typeof user !== "string")
		throw new Error("INVALID_INPUT");

	const [ rows ] = await db.query("SELECT id FROM users WHERE username = ? limit 1", [ user ]);
        if (rows.length === 0)
                throw new Error("NOT_FOUND_USER");
        const user_id = rows[0].id;

	await db.query(`DELETE FROM todo WHERE id = ?`, [ user_id ]);
};

exports.dbAllUsers = async () => {
	try {
		const db = getDB();
		if (!db)
			throw new Error("DATABASE_FAILED");

		const [ rows ] = await db.query("SELECT * FROM todo");
		return (rows);

	} catch (err) {
		console.error("Database query error get: ", err);
		throw new Error(`DATABASE_QUERY_ERROR: ${err.message || err}`);
	}
};

exports.addUser = async (user_id, task) => {
	if (!user_id || !task)
		throw new Error("MISSING_INPUT");

	if (typeof user_id !== "number" || typeof task !== "string")
		throw new Error("INVALID_INPUT");

	const db = getDB();
	if (!db)
		throw new Error("DATABASE_NOT_EXISTS");

	await db.query("INSERT INTO todo (id, task) VALUES (?, ?)", [ user_id, task ]);
}

exports.getTasks = () => task;

exports.addNewTask = (newTask) => {
	task.push(newTask);
}

exports.deleteTask = (deleteTask) => {
	task = task.filter(task => task !== deleteTask);
}
