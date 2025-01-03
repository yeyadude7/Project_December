const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const pool = require("./db");
const { parse } = require("date-fns");

// Path to CSV file
const csvFilePath = path.resolve(
	__dirname,
	"webscraping/knightconnect_events.csv"
);

// Function to sanitize and parse the Date/Time field
function sanitizeAndParseDateTime(dateTimeStr) {
	// Remove the timezone part (e.g., "EST") before parsing
	const sanitizedStr = dateTimeStr.replace(/\s[A-Z]{2,4}$/, "");
	// Parse using the format
	return parse(sanitizedStr, "EEEE, MMMM d 'at' h:mma", new Date());
}

// Function to upsert events
async function upsertEvent(event) {
	const query = `
    INSERT INTO events (
      event_name, event_type, tags, web_link, start_time, end_time,
      photo_url, location, latitude, longitude, organization, source_url, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    ON CONFLICT (source_url) DO UPDATE SET
      event_name = EXCLUDED.event_name,
      event_type = EXCLUDED.event_type,
      tags = EXCLUDED.tags,
      web_link = EXCLUDED.web_link,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      photo_url = EXCLUDED.photo_url,
      location = EXCLUDED.location,
      latitude = EXCLUDED.latitude,
      longitude = EXCLUDED.longitude,
      organization = EXCLUDED.organization;
  `;

	const values = [
		event.event_name,
		event.event_type,
		event.tags,
		event.web_link,
		event.start_time,
		event.end_time,
		event.photo_url,
		event.location,
		event.latitude,
		event.longitude,
		event.organization,
		event.source_url,
		event.user_id,
	];

	await pool.query(query, values);
}

// Function to process the CSV
function processCSV(filePath) {
	return new Promise((resolve, reject) => {
		const events = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => {
				// Parse and sanitize the Date/Time field
				const startTime = sanitizeAndParseDateTime(row["Date/Time"]);

				// Handle optional fields
				const photoUrl =
					row["Event Cover Image URL"] !== "(No cover image URL found)"
						? row["Event Cover Image URL"]
						: null;
				const location =
					row.Location !== "(No location found)" ? row.Location : null;

				events.push({
					event_name: row.Title,
					event_type: 1, // Default event type; customize if necessary
					tags: null, // Customize if you have tag data
					web_link: row.URL,
					start_time: startTime,
					end_time: null, // Customize if you have end_time data
					photo_url: photoUrl,
					location: location,
					latitude: null, // Add geocoding logic if necessary
					longitude: null, // Add geocoding logic if necessary
					organization: row.Organization,
					source_url: row.URL,
					user_id: null, // Assign a user ID if required
				});
			})
			.on("end", () => resolve(events))
			.on("error", (error) => reject(error));
	});
}

// Main function
async function main() {
	try {
		const events = await processCSV(csvFilePath);
		console.log(`Processing ${events.length} events...`);
		for (const event of events) {
			await upsertEvent(event);
		}
		console.log("Database updated successfully!");
	} catch (error) {
		console.error("Error processing events:", error);
	} finally {
		await pool.end();
	}
}

// Run the script
main();
