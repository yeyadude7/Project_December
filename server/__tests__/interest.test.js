const request = require("supertest");
const express = require("express");
const interestRouter = require("../routes/interest");
const db = require("../db");

jest.mock("../db"); // Mock database for testing

const app = express();
app.use(express.json());
app.use("/api/interests", interestRouter);

describe("Interest Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	// Test: Get all available interests
	describe("GET /api/interests/all", () => {
		test("Successfully retrieves all interests", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 1, name: "AI/ML" },
					{ id: 2, name: "Photography" },
				],
			});

			const response = await request(app).get("/api/interests/all");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].name).toBe("AI/ML");
		});

		test("Handles server error when retrieving interests", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/interests/all");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get user-selected interests
	describe("GET /api/interests/:user_id", () => {
		test("Successfully retrieves user interests", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 1, name: "AI/ML" },
					{ id: 2, name: "Photography" },
				],
			});

			const response = await request(app).get("/api/interests/1");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].name).toBe("AI/ML");
		});

		test("Returns 404 when user has no interests", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/interests/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User interests not found.");
		});

		test("Handles server error when retrieving user interests", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/interests/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Add interests for a user
	describe("POST /api/interests/:user_id", () => {
		test("Successfully adds interests for a user", async () => {
			db.query.mockResolvedValueOnce({}); // Simulate successful insert

			const response = await request(app)
				.post("/api/interests/1")
				.send({ interest_ids: [1, 2] });

			expect(response.statusCode).toBe(201);
			expect(response.body.message).toBe(
				"Interests successfully added for the user."
			);
		});

		test("Fails with missing interest_ids", async () => {
			const response = await request(app).post("/api/interests/1").send({});

			expect(response.statusCode).toBe(400);
			expect(response.body.message).toBe(
				"user_id and a non-empty array of interest_ids are required."
			);
		});

		test("Handles server error during adding interests", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.post("/api/interests/1")
				.send({ interest_ids: [1, 2] });

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Remove an interest for a user
	describe("DELETE /api/interests/:user_id/:interest_id", () => {
		test("Successfully removes an interest for a user", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user_id: 1, interest_id: 1 }],
			});

			const response = await request(app).delete("/api/interests/1/1");

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Interest successfully removed.");
		});

		test("Returns 404 when interest does not exist", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).delete("/api/interests/1/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User interest not found.");
		});

		test("Handles server error when removing interest", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).delete("/api/interests/1/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Replace all user interests
	describe("PUT /api/interests/:user_id", () => {
		test("Successfully replaces user interests", async () => {
			db.query.mockResolvedValueOnce({}); // Simulate DELETE
			db.query.mockResolvedValueOnce({}); // Simulate INSERT

			const response = await request(app)
				.put("/api/interests/1")
				.send({ interest_ids: [1, 2] });

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe(
				"User interests successfully updated."
			);
		});

		test("Fails with invalid input", async () => {
			const response = await request(app).put("/api/interests/1").send({});

			expect(response.statusCode).toBe(400);
			expect(response.body.message).toBe(
				"user_id and an array of interest_ids are required."
			);
		});

		test("Handles server error during bulk update", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.put("/api/interests/1")
				.send({ interest_ids: [1, 2] });

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});
});
