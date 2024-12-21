const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

/// Create Actions
router.post("/create", async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			major,
			goal,
			photo,
			type_of_student,
			year,
			group_preference,
		} = req.body;

		// Sconst hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security

		const newUser = await pool.query(
			`INSERT INTO users (name, email, password, major, goal, photo, type_of_student, year, group_preference) 
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
			 RETURNING *`,
			[
				name,
				email,
				password,
				major,
				goal,
				photo,
				type_of_student,
				year,
				group_preference,
			]
		);

		res.json(newUser.rows[0]);
	} catch (err) {
		if (err.code === "23505") {
			// Unique constraint violation (e.g., email already exists)
			return res.status(409).json({ message: "Email is already in use." });
		}
		res.status(500).send("Server error");
	}
});

/// Change Actions

// Update a user
router.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const {
			name,
			email,
			password,
			major,
			goal,
			photo,
			type_of_student,
			year,
			group_preference,
		} = req.body;

		const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

		if (user.rows.length === 0) {
			return res.status(404).json({ message: "User not found." });
		}

		// Hash the password if provided
		const hashedPassword = password
			? await bcrypt.hash(password, 10)
			: user.rows[0].password;

		const updatedUser = await pool.query(
			`UPDATE users 
		 SET name = $1, email = $2, password = $3, major = $4, goal = $5, 
			 photo = $6, type_of_student = $7, year = $8, group_preference = $9 
		 WHERE id = $10 
		 RETURNING *`,
			[
				name || user.rows[0].name,
				email || user.rows[0].email,
				hashedPassword,
				major || user.rows[0].major,
				goal || user.rows[0].goal,
				photo || user.rows[0].photo,
				type_of_student || user.rows[0].type_of_student,
				year || user.rows[0].year,
				group_preference || user.rows[0].group_preference,
				id,
			]
		);

		res.json(updatedUser.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Change user email
router.put("/change-email/:id", async (req, res) => {
	const { id } = req.params;
	const { email } = req.body;

	try {
		const result = await pool.query(
			"UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
			[email, id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "User not found." });
		}

		res.json({ message: "Email updated successfully." });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Change user password
router.put("/change-password/:id", async (req, res) => {
	const { id } = req.params;
	const { password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
			hashedPassword,
			id,
		]);
		res.json({ message: "Password updated successfully." });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Get Information Actions

// Get all users
router.get("/all", async (req, res) => {
	try {
		const allUsers = await pool.query("SELECT * FROM users");
		res.json(allUsers.rows);
	} catch (err) {
		console.error(err.message);

		res.status(500).json({ error: err.message });
	}
});

// Get a user by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
		if (user.rows.length === 0) {
			return res.status(404).json({ message: "User not found." });
		}
		res.json(user.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: err.message });
	}
});

// Deletion Actions

// Delete a user
router.delete("/delete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleteUser = await pool.query(
			"DELETE FROM users WHERE id = $1 RETURNING *",
			[id]
		);
		if (deleteUser.rows.length > 0) {
			res.json({
				message: "User deleted successfully.",
				deletedUser: deleteUser.rows[0],
			});
		} else {
			res.status(404).json({ message: "User not found." });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
