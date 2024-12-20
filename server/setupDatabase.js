const pool = require("./db"); // Import the db connection

const setupDatabase = async () => {
	try {
		// Drop tables if they exist
		await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
		await pool.query(`DROP TABLE IF EXISTS events CASCADE;`);

		// Create the users table
		await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                major VARCHAR(255),
                goal INTEGER,
                photo VARCHAR(255),
                type_of_student VARCHAR(50),
                year VARCHAR(50),
                group_preference VARCHAR(255)
            );
        `);

		// Create the events table
		await pool.query(`
            CREATE TABLE events (
                event_id SERIAL PRIMARY KEY,
                event_name VARCHAR(255) NOT NULL,
                event_type INTEGER NOT NULL,
                tags VARCHAR(255),
                web_link VARCHAR(255),
                time TIMESTAMP NOT NULL,
                photo VARCHAR(255),
                location VARCHAR(255),
                latitude VARCHAR(50),
                longitude VARCHAR(50)
            );
        `);

		console.log("Database setup completed!");
	} catch (err) {
		console.error("Error setting up the database:", err.message);
	} finally {
		pool.end(); // Close the database connection
	}
};

setupDatabase();
