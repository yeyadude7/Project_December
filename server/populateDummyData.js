const pool = require("./db"); // Import the db connection
const { faker } = require("@faker-js/faker"); // For generating fake data

const populateDummyData = async () => {
	try {
		// Insert dummy data into the users table
		const userIds = [];
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

			const res = await pool.query(
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

			userIds.push(res.rows[0].id);
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

		// Insert dummy friendships and requests
		for (let i = 0; i < 10; i++) {
			const user1 = faker.helpers.arrayElement(userIds);
			let user2 = faker.helpers.arrayElement(userIds);
			while (user1 === user2) {
				user2 = faker.helpers.arrayElement(userIds);
			}
			const status = faker.helpers.arrayElement(["pending", "accepted"]);

			await pool.query(
				`INSERT INTO friendship_status (user1_id, user2_id, status) 
                 VALUES ($1, $2, $3)`,
				[user1, user2, status]
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
