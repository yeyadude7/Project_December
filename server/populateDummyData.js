const pool = require("./db");
const { faker } = require("@faker-js/faker");

const populateDummyData = async () => {
	try {
		console.log("Starting to populate dummy data...");

		// Insert static interests
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
		const interests = await pool.query(`SELECT id FROM interests`);
		const interestIds = interests.rows.map((row) => row.id);

		// Insert dummy users
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
		for (const userId of userIds) {
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
		for (let i = 0; i < 10; i++) {
			await pool.query(
				`INSERT INTO events 
                 (event_name, tags, web_link, start_time, end_time, photo_url, location, latitude, longitude, organization, source_url, user_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
				[
					faker.lorem.words(3),
					faker.helpers.arrayElement([
						"Technology",
						"Networking",
						"Health",
						"Art",
						"Education",
					]),
					faker.internet.url(),
					faker.date.soon(),
					faker.date.soon({ days: 1 }),
					faker.image.url(),
					faker.location.streetAddress(),
					faker.location.latitude(),
					faker.location.longitude(),
					faker.company.name(),
					faker.internet.url(),
					faker.helpers.arrayElement(userIds),
				]
			);
		}

		console.log("Dummy data populated successfully!");
	} catch (err) {
		console.error("Error populating dummy data:", err.message);
		throw err;
	}
};

module.exports = populateDummyData;
