const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const classes = await pool.query("SELECT * FROM catalogue_classes");
        res.json(classes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post("/schedule", async (req, res) => {
    const { user_id, class_id, day_of_week, start_time, end_time, location } = req.body;

    try {
        const newClassSchedule = await pool.query(
            `INSERT INTO classes (user_id, class_id, day_of_week, start_time, end_time, location) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, class_id, day_of_week, start_time, end_time, location]
        );
        res.json(newClassSchedule.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get("/users/:class_id", async (req, res) => {
    const { class_id } = req.params;

    try {
        const usersInClass = await pool.query(
            `SELECT u.id, u.name, u.email, u.major, u.year, cl.day_of_week, cl.start_time, cl.end_time, cl.location
             FROM classes cl
             JOIN users u ON cl.user_id = u.id
             WHERE cl.class_id = $1`,
            [class_id]
        );

        if (usersInClass.rows.length === 0) {
            return res.status(404).json({ message: "No users found for this class." });
        }

        res.json(usersInClass.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const userClasses = await pool.query(
            `SELECT c.class_name, cl.day_of_week, cl.start_time, cl.end_time, cl.location 
            FROM classes cl
            JOIN catalogue_classes c ON cl.class_id = c.class_id
            WHERE cl.user_id = $1`,
            [id]
        );
        res.json(userClasses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { class_id, day_of_week, start_time, end_time, location } = req.body;

    try {
        const updatedClass = await pool.query(
            `UPDATE classes 
            SET day_of_week = $1, start_time = $2, end_time = $3, location = $4
            WHERE user_id = $5 AND class_id = $6
            RETURNING *`,
            [day_of_week, start_time, end_time, location, id, class_id]
        );

        if (updatedClass.rows.length === 0) {
            return res.status(404).json({ message: "Class not found or not assigned to user." });
        }

        res.json(updatedClass.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const { class_id } = req.body;

    try {
        const deletedClass = await pool.query(
            `DELETE FROM classes WHERE user_id = $1 AND class_id = $2 RETURNING *`,
            [id, class_id]
        );

        if (deletedClass.rows.length === 0) {
            return res.status(404).json({ message: "Class not found or not assigned to user." });
        }

        res.json({ message: "Class deleted successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
