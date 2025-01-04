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

router.get("/search", async (req, res) => {
	const { query, user_id } = req.query;

	if (!query) {
		return handleBadRequestError(res, "Search query is required.");
	}

	if (!user_id) {
		return handleBadRequestError(res, "user_id is required.");
	}

	try {
		// Search for users by name or email excluding the current user
		const searchResults = await pool.query(
			`SELECT *
             FROM users 
             WHERE (name ILIKE $1 OR email ILIKE $1) AND id != $2`,
			[`%${query}%`, user_id]
		);

		// Return search results
		res.status(200).json(searchResults.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});


// Search Friends or Users
router.get("/Aisearch", async (req, res) => {
    const { query, user_id, friendship_status, namestartswith, order, major, type_of_student, year } = req.query;

    console.log("Received query parameters:", req.query);

    if (!user_id) {
        return handleBadRequestError(res, "user_id is required.");
    }

    try {
        let searchResults;

        // Dynamically construct the search condition based on namestartswith
        let searchCondition = "";
        if (namestartswith === "yes") {
            searchCondition = `users.name ILIKE $2 || '%'`; // Search for names starting with the query
        } else {
            searchCondition = `(users.name ILIKE $2 OR users.email ILIKE $2)`; // Default behavior
        }

        // Dynamically add conditions for major, type_of_student, and year if they are provided
        let additionalConditions = [];

        // Add conditions for major, type_of_student, and year if provided
        if (major) {
            additionalConditions.push(`users.major ILIKE '%${major}%'`);
        }

        if (type_of_student) {
            additionalConditions.push(`users.type_of_student ILIKE '%${type_of_student}%'`);
        }

        if (year) {
            additionalConditions.push(`users.year ILIKE '%${year}%'`);
        }

        // Combine all conditions
        let whereClause = `AND ($2 = '' OR ${searchCondition})`;

        if (additionalConditions.length > 0) {
            whereClause += ` AND ${additionalConditions.join(' AND ')}`;
        }

		if(!friendship_status){
			searchResults = await pool.query(
			`SELECT users.* 
            FROM users
			WHERE users.id != $1 
			${whereClause}`,
			[user_id, `${query}`]
			);
		}
		else{
        // Query with dynamic conditions
        searchResults = await pool.query(
            `SELECT users.*
			FROM friendship_status
			JOIN users
            ON (users.id = friendship_status.user1_id AND friendship_status.user2_id = $1)
        		OR (users.id = friendship_status.user2_id AND friendship_status.user1_id = $1)
			WHERE friendship_status.status = $3
			AND users.id != $1 
            ${whereClause}
            ORDER BY friendship_status.created_at ${order};`,
            [user_id, `${query}`, friendship_status]
        );
		}

        res.status(200).json(searchResults.rows);
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
