const pool = require("./db");

const setupDatabase = async () => {
	try {
		console.log("Setting up database...");

		// Drop existing tables
		await pool.query(`DROP TABLE IF EXISTS user_interests CASCADE`);
		await pool.query(`DROP TABLE IF EXISTS interests CASCADE`);
		await pool.query(`DROP TABLE IF EXISTS events CASCADE`);
		await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

		// Create tables
		await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                major VARCHAR(255),
                goal INTEGER,
                photo TEXT,
                type_of_student VARCHAR(255),
                year VARCHAR(255),
                group_preference VARCHAR(255)
            );
        `);

		await pool.query(`
            CREATE TABLE interests (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        `);

		await pool.query(`
            CREATE TABLE user_interests (
                user_id INTEGER REFERENCES users(id),
                interest_id INTEGER REFERENCES interests(id),
                PRIMARY KEY (user_id, interest_id)
            );
        `);

		await pool.query(`
            CREATE TABLE events (
                event_id SERIAL PRIMARY KEY,
                event_name VARCHAR(255) NOT NULL,
                tags VARCHAR(255),
                web_link TEXT,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP,
                photo_url TEXT,
                location VARCHAR(255),
                latitude DECIMAL(9, 6),
                longitude DECIMAL(9, 6),
                organization VARCHAR(255),
                source_url TEXT UNIQUE,
                user_id INTEGER REFERENCES users(id),
                no_of_attendees INTEGER NOT NULL DEFAULT 0
            );
        `);

		console.log("Database setup completed!");
	} catch (err) {
		console.error("Error setting up the database:", err.message);
		throw err;
	}
};

module.exports = setupDatabase;
