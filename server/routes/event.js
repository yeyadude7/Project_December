const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

// Create Event
router.post("/create", async (req, res) => {
	const {
		event_name,
		event_type,
		tags,
		web_link,
		start_time,
		end_time,
		photo_url,
		location,
		latitude,
		longitude,
		organization,
		source_url,
		user_id,
	} = req.body;

	if (!event_name || !event_type || !start_time || !location) {
		return handleBadRequestError(res, "Missing required fields.");
	}

	try {
		const newEvent = await pool.query(
			`INSERT INTO events 
            (event_name, event_type, tags, web_link, start_time, end_time, photo_url, location, latitude, longitude, organization, source_url, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            RETURNING *`,
			[
				event_name,
				event_type,
				tags,
				web_link,
				start_time,
				end_time,
				photo_url,
				location,
				latitude,
				longitude,
				organization,
				source_url,
				user_id,
			]
		);

		res.status(201).json(newEvent.rows[0]);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Get All Events
router.get("/all", async (req, res) => {
	try {
		const allEvents = await pool.query(`SELECT * FROM events`);
		res.json(allEvents.rows);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Search Events
router.get("/search", async (req, res) => {
    const { query, tags, start_time } = req.query;
    const searchQuery = `%${query || ""}%`;
    const searchTags = tags ? `%${tags}%` : null;

    try {
        const searchedEvents = await pool.query(
            `SELECT * FROM events 
             WHERE (event_name ILIKE $1 OR tags ILIKE $1)
             AND ($2::text IS NULL OR tags ILIKE $2)
             AND ($3::timestamp IS NULL OR start_time >= $3)`,
            [searchQuery, searchTags, start_time || null]
        );

		console.log("HULULU: ", searchedEvents.rows);
        res.status(200).json(searchedEvents.rows);
		// res.status(200).json(null);
    } catch (err) {
        console.error("Error during search:", err.message);
        handleServerError(res, err);
    }
});

// Get Event by ID
router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const event = await pool.query(`SELECT * FROM events WHERE event_id = $1`, [
			id,
		]);

		if (event.rows.length === 0) {
			return handleNotFoundError(res, "Event");
		}

		res.json(event.rows[0]);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Update Event
router.put("/update/:id", async (req, res) => {
	const { id } = req.params;
	const {
		event_name,
		event_type,
		tags,
		web_link,
		start_time,
		end_time,
		photo_url,
		location,
		latitude,
		longitude,
		organization,
		source_url,
		user_id,
	} = req.body;

	try {
		const updatedEvent = await pool.query(
			`UPDATE events 
             SET 
                 event_name = COALESCE($1, event_name),
				 event_type = COALESCE($2, event_type),
                 tags = COALESCE($3, tags),
                 web_link = COALESCE($4, web_link),
                 start_time = COALESCE($5, start_time),
                 end_time = COALESCE($6, end_time),
                 photo_url = COALESCE($7, photo_url),
                 location = COALESCE($8, location),
                 latitude = COALESCE($9, latitude),
                 longitude = COALESCE($10, longitude),
                 organization = COALESCE($11, organization),
                 source_url = COALESCE($12, source_url),
                 user_id = COALESCE($13, user_id),
                 updated_at = CURRENT_TIMESTAMP
             WHERE event_id = $14 
             RETURNING *`,
			[
				event_name,
				event_type,
				tags,
				web_link,
				start_time,
				end_time,
				photo_url,
				location,
				latitude,
				longitude,
				organization,
				source_url,
				user_id,
				id,
			]
		);

		if (updatedEvent.rows.length === 0) {
			return handleNotFoundError(res, "Event");
		}

		res.json(updatedEvent.rows[0]);
	} catch (err) {
		handleServerError(res, err);
	}
});

// Delete Event
router.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			"DELETE FROM events WHERE event_id = $1 RETURNING *",
			[id]
		);

		if (result.rows.length === 0) {
			return handleNotFoundError(res, "Event");
		}

		res.status(200).json({
			message: "Event deleted successfully.",
			event: result.rows[0],
		});
	} catch (err) {
		handleServerError(res, err);
	}
});

// Handle RSVP for any event
router.post("/rsvp", async (req, res) => {
    const { user_id, event_id, did_rsvp } = req.body;

    if (!user_id || !event_id || did_rsvp === undefined) {
        return res.status(400).json({ message: "Invalid input." });
    }

    try {
        // Check if an RSVP record already exists
        const rsvpRecord = await pool.query(
            "SELECT did_rsvp FROM event_attendance WHERE user_id = $1 AND event_id = $2",
            [user_id, event_id]
        );

        if (rsvpRecord.rows.length > 0) {
            const existingRSVP = rsvpRecord.rows[0].did_rsvp;

            // Update the RSVP status
            await pool.query(
                `UPDATE event_attendance
                 SET did_rsvp = $1
                 WHERE user_id = $2 AND event_id = $3`,
                [did_rsvp, user_id, event_id]
            );

            // Adjust the no_of_attendees in the events table
            if (existingRSVP !== did_rsvp) {
                const adjustment = did_rsvp ? 1 : -1;
                await pool.query(
                    `UPDATE events
                     SET no_of_attendees = no_of_attendees + $1
                     WHERE event_id = $2`,
                    [adjustment, event_id]
                );
            }

            return res.status(200).json({ message: "RSVP processed successfully." });
        }

        // Insert a new RSVP record
        await pool.query(
            `INSERT INTO event_attendance (user_id, event_id, did_rsvp)
             VALUES ($1, $2, $3)`,
            [user_id, event_id, did_rsvp]
        );

        // Increment the no_of_attendees if RSVP is true
        if (did_rsvp) {
            await pool.query(
                `UPDATE events
                 SET no_of_attendees = no_of_attendees + 1
                 WHERE event_id = $1`,
                [event_id]
            );
        }

        return res.status(201).json({ message: "RSVP created successfully." });
    } catch (error) {
        console.error("RSVP error:", error.message);
        return res.status(500).json({ message: "An error occurred while processing the RSVP." });
    }
});

module.exports = router;
