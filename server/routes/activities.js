const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

// Create Activity
router.post("/create", async (req, res) => {
	const { user_id, activity_name, position } = req.body;

	if (!user_id || !activity_name || !position) {
		return handleBadRequestError(res, "Missing required fields.");
	}

	try {
		const result = await pool.query(
			`INSERT INTO user_activities (user_id, activity_name, position)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, activity_name) DO NOTHING
             RETURNING *`,
			[user_id, activity_name, position]
		);

		if (result.rows.length === 0) {
			return handleBadRequestError(
				res,
				"Activity already exists for this user."
			);
		}

		res.status(201).json(result.rows[0]);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Read User Activities
router.get("/user/:user_id", async (req, res) => {
	const { user_id } = req.params;

	try {
		const result = await pool.query(
			`SELECT activity_name, position FROM user_activities WHERE user_id = $1`,
			[user_id]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "User activities");
		}

		res.status(200).json(result.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Update Activity
router.put("/update", async (req, res) => {
	const { user_id, activity_name, position } = req.body;

	if (!user_id || !activity_name || !position) {
		return handleBadRequestError(res, "Missing required fields.");
	}

	try {
		const result = await pool.query(
			`UPDATE user_activities 
             SET position = $1 
             WHERE user_id = $2 AND activity_name = $3
             RETURNING *`,
			[position, user_id, activity_name]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Activity for this user");
		}

		res.status(200).json(result.rows[0]);
	} catch (err) {
		handleServerError(res, err);
	}
});

router.delete("/delete", async (req, res) => {
	const { user_id, activity_name } = req.body;

	if (!user_id || !activity_name) {
		return handleBadRequestError(res, "Missing required fields.");
	}

	try {
		const result = await pool.query(
			`DELETE FROM user_activities WHERE user_id = $1 AND activity_name = $2 RETURNING *`,
			[user_id, activity_name]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Activity for this user");
		}

		res.status(200).json({ message: "Activity deleted successfully." });
	} catch (err) {
		handleServerError(res, err);
	}
});

router.get("/search", async (req, res) => {
	const { activity_name } = req.query;

	if (!activity_name) {
		return handleBadRequestError(res, "Missing activity name.");
	}

	try {
		const result = await pool.query(
			`SELECT DISTINCT u.id, u.name, u.email, ua.activity_name, ua.position
             FROM user_activities ua
             JOIN users u ON ua.user_id = u.id
             WHERE LOWER(ua.activity_name) = LOWER($1)`,
			[activity_name]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Users with the specified activity");
		}

		res.status(200).json(result.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

module.exports = router;
