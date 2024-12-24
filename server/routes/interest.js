const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

// Get all available interests
router.get("/all", async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM interests`);
		res.status(200).json(result.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Get user-selected interests
router.get("/:user_id", async (req, res) => {
	const { user_id } = req.params;

	if (!user_id) {
		return handleBadRequestError(res, "user_id is required.");
	}

	try {
		const result = await pool.query(
			`SELECT i.id, i.name 
             FROM user_interests ui
             JOIN interests i ON ui.interest_id = i.id
             WHERE ui.user_id = $1`,
			[user_id]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "User interests");
		}

		res.status(200).json(result.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Add interests for a user
router.post("/:user_id", async (req, res) => {
	const { user_id } = req.params;
	const { interest_ids } = req.body; // Array of interest IDs

	if (!user_id || !Array.isArray(interest_ids) || interest_ids.length === 0) {
		return handleBadRequestError(
			res,
			"user_id and a non-empty array of interest_ids are required."
		);
	}

	try {
		// Insert interests for the user
		const insertPromises = interest_ids.map((interest_id) =>
			pool.query(
				`INSERT INTO user_interests (user_id, interest_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT DO NOTHING`,
				[user_id, interest_id]
			)
		);

		await Promise.all(insertPromises);

		res
			.status(201)
			.json({ message: "Interests successfully added for the user." });
	} catch (err) {
		handleServerError(res, err);
	}
});

// Remove an interest for a user
router.delete("/:user_id/:interest_id", async (req, res) => {
	const { user_id, interest_id } = req.params;

	if (!user_id || !interest_id) {
		return handleBadRequestError(
			res,
			"Both user_id and interest_id are required."
		);
	}

	try {
		const result = await pool.query(
			`DELETE FROM user_interests 
             WHERE user_id = $1 AND interest_id = $2
             RETURNING *`,
			[user_id, interest_id]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "User interest");
		}

		res.status(200).json({ message: "Interest successfully removed." });
	} catch (err) {
		handleServerError(res, err);
	}
});

// Replace all user interests (update interests in bulk)
router.put("/:user_id", async (req, res) => {
	const { user_id } = req.params;
	const { interest_ids } = req.body; // Array of new interest IDs

	if (!user_id || !Array.isArray(interest_ids)) {
		return handleBadRequestError(
			res,
			"user_id and an array of interest_ids are required."
		);
	}

	try {
		// Begin transaction
		await pool.query("BEGIN");

		// Remove all existing interests for the user
		await pool.query(`DELETE FROM user_interests WHERE user_id = $1`, [
			user_id,
		]);

		// Insert the new interests
		const insertPromises = interest_ids.map((interest_id) =>
			pool.query(
				`INSERT INTO user_interests (user_id, interest_id) 
                 VALUES ($1, $2)`,
				[user_id, interest_id]
			)
		);

		await Promise.all(insertPromises);

		// Commit transaction
		await pool.query("COMMIT");

		res.status(200).json({ message: "User interests successfully updated." });
	} catch (err) {
		// Rollback in case of an error
		await pool.query("ROLLBACK");
		handleServerError(res, err);
	}
});

module.exports = router;
