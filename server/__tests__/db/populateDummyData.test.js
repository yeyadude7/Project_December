const pool = require("../../db");
const populateDummyData = require("../../populateDummyData");
const setupDatabase = require("../../setupDatabase");

beforeEach(async () => {
	console.log("BeforeEach: Setting up database...");
	await setupDatabase();
});

afterAll(async () => {
	console.log("AfterAll: Closing database connection...");
	await pool.end();
});

test("populateDummyData inserts correct number of users", async () => {
	await populateDummyData();
	const result = await pool.query("SELECT COUNT(*) FROM users");
	expect(parseInt(result.rows[0].count, 10)).toBe(15);
});

test("populateDummyData inserts at least one event", async () => {
	await populateDummyData();
	const result = await pool.query("SELECT COUNT(*) FROM events");
	expect(parseInt(result.rows[0].count, 10)).toBeGreaterThan(0);
});

test("populateDummyData inserts interests", async () => {
	await populateDummyData();
	const result = await pool.query("SELECT COUNT(*) FROM interests");
	expect(parseInt(result.rows[0].count, 10)).toBeGreaterThan(0);
});

test("populateDummyData creates friendships and friend requests", async () => {
	// Add logic for friendships and friend requests
});

test("populateDummyData ensures no duplicate source_url", async () => {
	await populateDummyData();
	const result = await pool.query(
		"SELECT COUNT(DISTINCT source_url) AS unique_source_urls FROM events"
	);
	const totalCount = await pool.query(
		"SELECT COUNT(*) AS total_urls FROM events"
	);
	expect(parseInt(result.rows[0].unique_source_urls, 10)).toBe(
		parseInt(totalCount.rows[0].total_urls, 10)
	);
});
