const request = require("supertest");
const express = require("express");
const activitiesRouter = require("../routes/activities");
const db = require("../db");

jest.mock("../db"); // Mock the database module

const app = express();
app.use(express.json());
app.use("/api/activities", activitiesRouter);

describe("Activities API Endpoints", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	// Test: Create Activity
	describe("POST /api/activities/create", () => {
		test("Successfully creates an activity", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 1, activity_name: "Badminton", position: "President" },
				],
			});

			const response = await request(app).post("/api/activities/create").send({
				user_id: 1,
				activity_name: "Badminton",
				position: "President",
			});

			expect(response.statusCode).toBe(201);
			expect(response.body.activity_name).toBe("Badminton");
			expect(response.body.position).toBe("President");
		});

		test("Fails with missing required fields", async () => {
			const response = await request(app).post("/api/activities/create").send({
				user_id: 1,
			});

			expect(response.statusCode).toBe(400);
			expect(response.body.message).toBe("Missing required fields.");
		});

		test("Handles activity already existing for the user", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).post("/api/activities/create").send({
				user_id: 1,
				activity_name: "Badminton",
				position: "President",
			});

			expect(response.statusCode).toBe(400);
			expect(response.body.message).toBe(
				"Activity already exists for this user."
			);
		});

		test("Handles server error", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).post("/api/activities/create").send({
				user_id: 1,
				activity_name: "Badminton",
				position: "President",
			});

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get Activities for a User
	describe("GET /api/activities/user/:user_id", () => {
		test("Successfully retrieves activities for a user", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ activity_name: "Badminton", position: "President" }],
			});

			const response = await request(app).get("/api/activities/user/1");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(1);
			expect(response.body[0].activity_name).toBe("Badminton");
		});

		test("Handles no activities found for user", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/activities/user/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User activities not found.");
		});

		test("Handles server error", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/activities/user/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Update Activity
	describe("PUT /api/activities/update", () => {
		test("Successfully updates an activity", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user_id: 1, activity_name: "Badminton", position: "Coach" }],
			});

			const response = await request(app).put("/api/activities/update").send({
				user_id: 1,
				activity_name: "Badminton",
				position: "Coach",
			});

			expect(response.statusCode).toBe(200);
			expect(response.body.position).toBe("Coach");
		});

		test("Handles activity not found for user", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).put("/api/activities/update").send({
				user_id: 1,
				activity_name: "Chess Club",
				position: "Member",
			});

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("Activity for this user not found.");
		});

		test("Handles server error", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).put("/api/activities/update").send({
				user_id: 1,
				activity_name: "Badminton",
				position: "Coach",
			});

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Delete Activity
	describe("DELETE /api/activities/delete", () => {
		test("Successfully deletes an activity", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user_id: 1, activity_name: "Badminton", position: "President" },
				],
			});

			const response = await request(app)
				.delete("/api/activities/delete")
				.send({
					user_id: 1,
					activity_name: "Badminton",
				});

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Activity deleted successfully.");
		});

		test("Handles activity not found for user", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.delete("/api/activities/delete")
				.send({
					user_id: 1,
					activity_name: "Chess Club",
				});

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("Activity for this user not found.");
		});

		test("Handles server error", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.delete("/api/activities/delete")
				.send({
					user_id: 1,
					activity_name: "Badminton",
				});

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Search for Users with Similar Activities
	describe("GET /api/activities/search", () => {
		test("Successfully retrieves users with the same activity", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						id: 1,
						name: "John Doe",
						email: "john@example.com",
						activity_name: "Badminton",
						position: "Player",
					},
				],
			});

			const response = await request(app)
				.get("/api/activities/search")
				.query({ activity_name: "Badminton" });

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(1);
			expect(response.body[0].name).toBe("John Doe");
		});

		test("Handles no users found for the activity", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.get("/api/activities/search")
				.query({ activity_name: "Chess Club" });

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe(
				"Users with the specified activity not found."
			);
		});

		test("Handles server error", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.get("/api/activities/search")
				.query({ activity_name: "Badminton" });

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});
});
