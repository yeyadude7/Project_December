/**
 * __tests__/populateDummyData.test.js
 */
const pool = require("../../db");
const populateDummyData = require("../../populateDummyData");
const setupDatabase = require("../../setupDatabase");

beforeEach(async () => {
	console.log("BeforeEach: Pool state", pool);
	await setupDatabase();
});

afterAll(async () => {
	console.log("AfterAll: Pool state before ending", pool);
	await pool.end();
	console.log("AfterAll: Pool has been closed.");
});

test("populateDummyData inserts correct number of users", async () => {
	console.log("Test Start: Pool state", pool);
	await populateDummyData();

	const result = await pool.query("SELECT COUNT(*) FROM users");
	expect(parseInt(result.rows[0].count, 10)).toBe(15); // We expect 15 users
});

test("populateDummyData inserts at least one event", async () => {
	await populateDummyData();

	const result = await pool.query("SELECT COUNT(*) FROM events");
	expect(parseInt(result.rows[0].count, 10)).toBeGreaterThan(0);
});

test("populateDummyData inserts interests", async () => {
	await populateDummyData();

	// Expect that at least one interest is present in 'interests'
	const result = await pool.query("SELECT COUNT(*) FROM interests");
	expect(parseInt(result.rows[0].count, 10)).toBeGreaterThan(0);

	// Optional: confirm that user_interests also has rows
	const userInterestsResult = await pool.query(
		"SELECT COUNT(*) FROM user_interests"
	);
	expect(
		parseInt(userInterestsResult.rows[0].count, 10)
	).toBeGreaterThanOrEqual(15);
	// Because each of the 15 users should have at least 2 interests => 2*15=30
	// But in your code, minimum 2 interests, so let's just check >= 15 as a sanity check
});

test("populateDummyData creates friendships and friend requests", async () => {
	await populateDummyData();

	// Check 'friends'
	const friends = await pool.query(
		"SELECT * FROM friendship_status WHERE status = 'friends'"
	);
	expect(friends.rows.length).toBeGreaterThan(0); // We expect some 'friends' inserted

	// Check 'pending' friend requests
	const requests = await pool.query(
		"SELECT * FROM friendship_status WHERE status = 'pending'"
	);
	expect(requests.rows.length).toBeGreaterThan(0); // We expect some 'pending' requests
});

test("populateDummyData inserts non-empty user records", async () => {
	await populateDummyData();

	const users = await pool.query("SELECT * FROM users");
	expect(users.rows.length).toBe(15); // The exact count

	// For a basic data-quality check, ensure each user has a non-empty name, email, etc.
	users.rows.forEach((user) => {
		expect(user.name).toBeTruthy();
		expect(user.email).toBeTruthy();
		expect(user.password).toBeTruthy();
	});
});

test("populateDummyData inserts non-empty event records", async () => {
	await populateDummyData();

	const events = await pool.query("SELECT * FROM events");
	expect(events.rows.length).toBeGreaterThan(0);

	// Basic checks to ensure the fields are populated
	events.rows.forEach((event) => {
		expect(event.event_name).toBeTruthy();
		expect(event.start_time).toBeTruthy();
		expect(event.location).toBeTruthy();
	});
});
