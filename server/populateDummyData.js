// populateDummyData.js

const pool = require("./db");
const { faker } = require("@faker-js/faker");

const populateDummyData = async () => {
	try {
		console.log("Starting to populate dummy data...");

		// Insert static interests (with ON CONFLICT to avoid duplicates)
		const interestNames = [
			"Technology",
			"Art",
			"Sports",
			"Gaming",
			"Education",
			"Music",
		];
		const interestIds = [];
		for (const interest of interestNames) {
			const insertResult = await pool.query(
				`INSERT INTO interests (name) VALUES ($1)
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
				[interest]
			);
			if (insertResult.rows.length > 0) {
				// Inserted a new interest
				interestIds.push(insertResult.rows[0].id);
			} else {
				// Interest already exists, get its ID
				const existing = await pool.query(
					`SELECT id FROM interests WHERE name = $1`,
					[interest]
				);
				interestIds.push(existing.rows[0].id);
			}
		}

		// ---------- Insert dummy users ----------
		const userIds = [];
		for (let i = 0; i < 15; i++) {
			const name = faker.person.fullName();
			const email = faker.internet.email();
			const password = faker.internet.password();
			const major = faker.helpers.arrayElement([
				"Computer Science",
				"Mathematics",
				"Physics",
				"Engineering",
				"Business Administration",
			]);
			const goal = faker.number.int({ min: 1, max: 10 });
			const photo = faker.image.avatar();
			const type_of_student = faker.helpers.arrayElement([
				"Undergraduate",
				"Graduate",
			]);
			const year = faker.helpers.arrayElement([
				"Freshman",
				"Sophomore",
				"Junior",
				"Senior",
				"Master's",
				"PhD",
			]);
			const group_preference = faker.helpers.arrayElement([
				"Study Group",
				"Research Group",
				"Debate Team",
				"Workshop Team",
				"Project Team",
			]);

			const userResult = await pool.query(
				`INSERT INTO users 
         (name, email, password, major, goal, photo, type_of_student, year, group_preference) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
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
			userIds.push(userResult.rows[0].id);
		}

		// ---------- Assign interests to users ----------
		for (const userId of userIds) {
			const randomInterests = faker.helpers.arrayElements(
				interestIds,
				faker.number.int({ min: 2, max: 5 })
			);
			for (const interestId of randomInterests) {
				await pool.query(
					`INSERT INTO user_interests (user_id, interest_id)
           VALUES ($1, $2)`,
					[userId, interestId]
				);
			}
		}

		// ---------- Insert dummy events ----------
		for (let i = 0; i < 10; i++) {
			const eventName = faker.word.noun();
			const eventType = faker.number.int({ min: 1, max: 5 }); // e.g. 5 event types
			const tags = faker.helpers.arrayElement([
				"Technology",
				"Networking",
				"Health",
				"Art",
				"Education",
			]);
			const webLink = faker.internet.url();
			const startTime = faker.date.soon();
			const photo = faker.image.url();
			const location = faker.location.streetAddress();
			const latitude = faker.location.latitude();
			const longitude = faker.location.longitude();

			await pool.query(
				`INSERT INTO events 
         (event_name, event_type, tags, web_link, start_time, photo, location, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				[
					eventName,
					eventType,
					tags,
					webLink,
					startTime,
					photo,
					location,
					latitude,
					longitude,
				]
			);
		}

		// ---------- Insert dummy friendships ----------
		for (let i = 0; i < 20; i++) {
			try {
				let user1_id = faker.helpers.arrayElement(userIds);
				let user2_id = faker.helpers.arrayElement(userIds);

				while (user1_id === user2_id) {
					user2_id = faker.helpers.arrayElement(userIds);
				}

				const [small, large] =
					user1_id < user2_id ? [user1_id, user2_id] : [user2_id, user1_id];

				const existing = await pool.query(
					`SELECT 1 FROM friendship_status
           WHERE user1_id = $1 AND user2_id = $2`,
					[small, large]
				);

				if (existing.rows.length === 0) {
					await pool.query(
						`INSERT INTO friendship_status (user1_id, user2_id, status)
             VALUES ($1, $2, $3)`,
						[small, large, "friends"]
					);
				}
			} catch (err) {
				console.error("Error inserting friendship1:", err);
			}
		}
		//test change
		// ---------- Insert dummy friend requests ----------
		for (let i = 0; i < 10; i++) {
			try {
				let sender_id = faker.helpers.arrayElement(userIds);
				let receiver_id = faker.helpers.arrayElement(userIds);

				while (sender_id === receiver_id) {
					receiver_id = faker.helpers.arrayElement(userIds);
				}

				const [small, large] =
					sender_id < receiver_id
						? [sender_id, receiver_id]
						: [receiver_id, sender_id];

				const existing = await pool.query(
					`SELECT 1 FROM friendship_status
           WHERE user1_id = $1 AND user2_id = $2`,
					[small, large]
				);

				if (existing.rows.length === 0) {
					await pool.query(
						`INSERT INTO friendship_status (user1_id, user2_id, status)
             VALUES ($1, $2, $3)`,
						[sender_id, receiver_id, "pending"]
					);
				}
			} catch (err) {
				console.error("Error inserting friend request:", err);
			}
		}

		console.log("Dummy data populated successfully!");
	} catch (err) {
		console.error("Error populating dummy data:", err.message);
		throw err;
	}
};

module.exports = populateDummyData;
