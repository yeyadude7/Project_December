const fs = require("fs");
const path = require("path");
const pool = require("../db");

const setupDatabase = async () => {
	try {
		console.log("Setting up database...");

		// Read the schema.sql file
		const schemaPath = "../server/schema/schema.sql";
		const schema = fs.readFileSync(schemaPath, "utf8");

		// Execute the SQL schema
		await pool.query(schema);

		console.log("Database setup completed!");
	} catch (err) {
		console.error("Error setting up the database:", err.message);
		throw err;
	}
};

module.exports = setupDatabase;
