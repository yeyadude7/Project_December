const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

// Send Friend Request
router.post("/request", async (req, res) => {
	const { user1_id, user2_id } = req.body;

	if (!user1_id || !user2_id) {
		return handleBadRequestError(
			res,
			"Both user1_id and user2_id are required."
		);
	}

	try {
		// Check if a relationship already exists
		const existing = await pool.query(
			`SELECT * FROM friendship_status WHERE user1_id = $1 AND user2_id = $2`,
			[user1_id, user2_id]
		);

		if (existing.rows.length > 0) {
			return handleBadRequestError(
				res,
				"A friendship request already exists or is pending."
			);
		}

		// Create a new friend request
		await pool.query(
			`INSERT INTO friendship_status (user1_id, user2_id, status) VALUES ($1, $2, $3)`,
			[user1_id, user2_id, "pending"]
		);

		res.status(201).json({ message: "Friend request sent successfully." });
	} catch (err) {
		handleServerError(res, err);
	}
});

// Accept Friend Request
router.put("/accept", async (req, res) => {
	const { user1_id, user2_id } = req.body;

	if (!user1_id || !user2_id) {
		return handleBadRequestError(
			res,
			"Both user1_id and user2_id are required."
		);
	}

	try {
		const result = await pool.query(
			`UPDATE friendship_status SET status = $3 
             WHERE user1_id = $1 AND user2_id = $2 AND status = 'pending'
             RETURNING *`,
			[user1_id, user2_id, "accepted"]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Friend request");
		}

		res.status(200).json({ message: "Friend request accepted." });
	} catch (err) {
		handleServerError(res, err);
	}
});

// Reject Friend Request
router.put("/reject", async (req, res) => {
	const { user1_id, user2_id } = req.body;

	if (!user1_id || !user2_id) {
		return handleBadRequestError(
			res,
			"Both user1_id and user2_id are required."
		);
	}

	try {
		const result = await pool.query(
			`DELETE FROM friendship_status 
             WHERE user1_id = $1 AND user2_id = $2 AND status = 'pending'
             RETURNING *`,
			[user1_id, user2_id]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Friend request");
		}

		res.status(200).json({ message: "Friend request rejected." });
	} catch (err) {
		handleServerError(res, err);
	}
});

// List Friend Requests
router.get("/requests", async (req, res) => {
	const { user_id } = req.query;

	if (!user_id) {
		return handleBadRequestError(res, "user_id is required.");
	}

	try {
		const requests = await pool.query(
			`SELECT * FROM friendship_status 
             WHERE user2_id = $1 AND status = 'pending'`,
			[user_id]
		);

		res.status(200).json(requests.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

// List Friends
router.get("/", async (req, res) => {
	const { user_id } = req.query;

	if (!user_id) {
		return handleBadRequestError(res, "user_id is required.");
	}

	try {
		const friends = await pool.query(
			`SELECT * FROM friendship_status 
             WHERE (user1_id = $1 OR user2_id = $1) AND status = 'accepted'`,
			[user_id]
		);

		res.status(200).json(friends.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

module.exports = router;
