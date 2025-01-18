const pool = require("./db");
const { faker } = require("@faker-js/faker");

const isDebugMode = process.env.LOG_LEVEL === "DEBUG";

const log = (message) => {
	if (isDebugMode) {
		console.log(message);
	}
};

const populateDummyData = async () => {
	try {
		log("Starting to populate dummy data...");

		// Insert static interests
		log("Inserting interests...");
		const interestNames = [
			"Technology",
			"Art",
			"Sports",
			"Gaming",
			"Education",
			"Music",
		];
		for (const interest of interestNames) {
			await pool.query(
				`INSERT INTO interests (name) VALUES ($1)
                 ON CONFLICT (name) DO NOTHING`,
				[interest]
			);
		}

		// Get interest IDs
		log("Fetching interest IDs...");
		const interests = await pool.query(`SELECT id FROM interests`);
		const interestIds = interests.rows.map((row) => row.id);

		// Insert dummy users
		log("Inserting dummy users...");
		const userIds = [];
		for (let i = 0; i < 15; i++) {
			const userResult = await pool.query(
				`INSERT INTO users 
                 (name, email, password, major, goal, photo, type_of_student, year, group_preference)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 RETURNING id`,
				[
					faker.person.fullName(),
					faker.internet.email(),
					faker.internet.password(),
					faker.helpers.arrayElement([
						"Computer Science",
						"Mathematics",
						"Physics",
						"Engineering",
						"Business Administration",
					]),
					faker.number.int({ min: 1, max: 10 }),
					faker.image.avatar(),
					faker.helpers.arrayElement(["Undergraduate", "Graduate"]),
					faker.helpers.arrayElement([
						"Freshman",
						"Sophomore",
						"Junior",
						"Senior",
						"Master's",
						"PhD",
					]),
					faker.helpers.arrayElement([
						"Study Group",
						"Research Group",
						"Debate Team",
						"Workshop Team",
						"Project Team",
					]),
				]
			);
			userIds.push(userResult.rows[0].id);
		}

		// Assign interests to users
		log("Assigning interests to users...");
		for (let i = 0; i < userIds.length; i++) {
			const userId = userIds[i];
			// Some users will have no interests
			if (i % 3 === 0) {
				log(`User ${userId} has no interests.`);
				continue;
			}
			const randomInterests = faker.helpers.arrayElements(
				interestIds,
				faker.number.int({ min: 2, max: 5 })
			);
			for (const interestId of randomInterests) {
				await pool.query(
					`INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)`,
					[userId, interestId]
				);
			}
		}

		// Insert dummy events
		log("Inserting dummy events...");
		const eventIds = [];
		for (let i = 0; i < 20; i++) {
			const userId =
				i % 5 === 0
					? null // Some events are created by no user
					: faker.helpers.arrayElement(userIds);

			const eventResult = await pool.query(
				`INSERT INTO events
				 (event_name, event_type, event_description, tags, web_link, start_time, end_time, photo_url, event_location, latitude, longitude, organization, source_url, user_id)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
				 RETURNING event_id`,
				[
					faker.lorem.words(3), // event_name
					faker.number.int({ min: 1, max: 5 }), // event_type
					faker.lorem.paragraph(), // description
					faker.helpers.arrayElement(["Technology", "Art", "Sports"]), // tags
					faker.internet.url(), // web_link
					faker.date.future(), // start_time
					faker.date.future({ days: 1 }), // end_time
					faker.image.url(), // photo_url
					faker.location.streetAddress(), // location
					faker.location.latitude(), // latitude
					faker.location.longitude(), // longitude
					faker.company.name(), // organization
					faker.internet.url(), // source_url
					userId, // user_id
				]
			);

			eventIds.push(eventResult.rows[0].event_id);
		}

		// Insert friend requests and friendships
		log("Inserting friend requests and friendships...");
		for (let i = 0; i < userIds.length; i++) {
			for (let j = i + 1; j < userIds.length; j++) {
				const relationshipType = faker.helpers.arrayElement([
					"pending",
					"accepted",
				]);

				if (faker.datatype.boolean()) {
					await pool.query(
						`INSERT INTO friendship_status (user1_id, user2_id, status)
                         VALUES ($1, $2, $3)`,
						[userIds[i], userIds[j], relationshipType]
					);
				}
			}
		}

		// Insert RSVPs
		log("Inserting RSVPs...");
		for (let i = 0; i < userIds.length; i++) {
			const userId = userIds[i];
			// Some users RSVP to many events, some to a few, and some to none
			const rsvpCount = i % 4 === 0 ? 0 : faker.number.int({ min: 1, max: 10 });
			const rsvpEvents = faker.helpers.arrayElements(eventIds, rsvpCount);

			for (const eventId of rsvpEvents) {
				await pool.query(
					`INSERT INTO event_attendance (user_id, event_id, did_rsvp)
                     VALUES ($1, $2, $3)`,
					[userId, eventId, true]
				);
			}
		}

		console.log("Dummy data populated successfully!");
	} catch (err) {
		console.error("Error populating dummy data:", err.message);
		throw err;
	}
};

module.exports = populateDummyData;
