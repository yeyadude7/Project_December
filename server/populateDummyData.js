const pool = require("./db"); // Import the db connection
const { faker } = require("@faker-js/faker"); // For generating fake data

const populateDummyData = async () => {
	try {
		// Insert static interests into the interests table
		const interests = [
			"AI/ML",
			"Photography",
			"Basketball",
			"Chess",
			"Piano",
			"Networking",
			"Health",
			"Education",
			"Art",
		];

		for (const interest of interests) {
			await pool.query(`INSERT INTO interests (name) VALUES ($1)`, [interest]);
		}

		// Insert dummy data into the users table
		for (let i = 0; i < 15; i++) {
			const name = faker.person.fullName();
			const email = faker.internet.email();
			const password = faker.internet.password(); // You can hash this if needed
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
				`INSERT INTO users (name, email, password, major, goal, photo, type_of_student, year, group_preference) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
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

			// Assign random interests to the user
			const userId = userResult.rows[0].id;
			const selectedInterests = faker.helpers.arrayElements(interests, {
				min: 1,
				max: 5,
			});

			for (const interestName of selectedInterests) {
				const interestResult = await pool.query(
					`SELECT id FROM interests WHERE name = $1`,
					[interestName]
				);
				const interestId = interestResult.rows[0].id;

				await pool.query(
					`INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)`,
					[userId, interestId]
				);
			}
		}

		// Insert dummy data into the events table
		for (let i = 0; i < 10; i++) {
			const event_name = faker.word.noun();
			const event_type = faker.number.int({ min: 1, max: 5 }); // Assuming 5 event types
			const tags = faker.helpers.arrayElement([
				"Technology",
				"Networking",
				"Health",
				"Art",
				"Education",
			]);
			const web_link = faker.internet.url();
			const time = faker.date.soon(); // Random future date
			const photo = faker.image.url();
			const location = faker.location.streetAddress();
			const latitude = faker.location.latitude();
			const longitude = faker.location.longitude();

			await pool.query(
				`INSERT INTO events (event_name, event_type, tags, web_link, time, photo, location, latitude, longitude) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
				[
					event_name,
					event_type,
					tags,
					web_link,
					time,
					photo,
					location,
					latitude,
					longitude,
				]
			);
		}

		console.log("Dummy data populated successfully!");
	} catch (err) {
		console.error("Error populating dummy data:", err.message);
	} finally {
		pool.end(); // Close the database connection
	}
};

populateDummyData();
