const pool = require("./db");

const setupDatabase = async () => {
	try {
		console.log("Setting up database...");

		// Drop existing tables
        await pool.query(`DROP TABLE IF EXISTS classes CASCADE`);
        await pool.query(`DROP TABLE IF EXISTS catalogue_classes CASCADE`);
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
                group_preference VARCHAR(255),
                is_verified BOOLEAN DEFAULT FALSE,
                verification_code VARCHAR(6)
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
                event_type INTEGER NOT NULL,
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
        await pool.query(`
            CREATE TABLE catalogue_classes (
                class_id SERIAL PRIMARY KEY,
                class_name VARCHAR(255) NOT NULL,
                description TEXT,
                department VARCHAR(255),
                credits INTEGER
            );
        `);

        await pool.query(`
            CREATE TABLE classes (
                class_id INTEGER REFERENCES catalogue_classes(class_id),
                user_id INTEGER REFERENCES users(id),
                day_of_week VARCHAR(255) NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                location VARCHAR(255),
                PRIMARY KEY (class_id, user_id, day_of_week, start_time)
            );
        `);

		console.log("Database setup completed!");
	} catch (err) {
		console.error("Error setting up the database:", err.message);
		throw err;
	}
};
setupDatabase();

module.exports = setupDatabase;
