const request = require("supertest");
const express = require("express");
const eventRouter = require("../routes/event");
const db = require("../db");

jest.mock("../db"); // Mock database for testing

const app = express();
app.use(express.json());
app.use("/api/event", eventRouter);

describe("Event Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	// Test: Create Event
	describe("POST /api/event/create", () => {
		test("Successfully creates an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ event_id: 1, event_name: "Tech Conference" }],
			});

			const response = await request(app).post("/api/event/create").send({
				event_name: "Tech Conference",
				event_type: 1,
				tags: "Technology, Networking",
				web_link: "https://techconference.com",
				time: "2024-12-20T10:00:00.000Z",
				photo: "https://example.com/photo.jpg",
				location: "Tech Hall",
				latitude: "40.7128",
				longitude: "-74.0060",
			});

			expect(response.statusCode).toBe(201);
			expect(response.body.event_name).toBe("Tech Conference");
		});
	});

	// Test: Get All Events
	describe("GET /api/event/all", () => {
		test("Successfully retrieves all events", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ event_id: 1, event_name: "Tech Conference" },
					{ event_id: 2, event_name: "Art Exhibition" },
				],
			});

			const response = await request(app).get("/api/event/all");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].event_name).toBe("Tech Conference");
		});
	});

	// Test: Search Events
	describe("GET /api/event/search", () => {
		test("Returns 200 with an empty array when no events match", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.get("/api/event/search")
				.query({ query: "Nonexistent Event" });

			expect(response.statusCode).toBe(200);
			expect(response.body).toEqual([]);
		});
	});

	// Test: Update Event
	describe("PUT /api/event/update/:id", () => {
		test("Successfully updates an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ event_id: 1, event_name: "Updated Conference" }],
			});

			const response = await request(app)
				.put("/api/event/update/1")
				.send({ event_name: "Updated Conference" });

			// Assertions
			expect(response.statusCode).toBe(200); // Ensure status is 200
			expect(response.body.event_name).toBe("Updated Conference"); // Ensure the event was updated
		});

		test("Fails when event is not found", async () => {
			// Simulate the event not being found
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.put("/api/event/update/99")
				.send({ event_name: "Nonexistent Event" });

			// Assertions
			expect(response.statusCode).toBe(404); // Ensure status is 404
			expect(response.body.message).toBe("Event not found."); // Ensure correct error message
		});
	});

	// Test: Delete Event
	describe("DELETE /api/event/delete/:id", () => {
		test("Successfully deletes an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ event_id: 1, event_name: "Tech Conference" }], // Simulate DELETE result
			});

			const response = await request(app).delete("/api/event/delete/1");

			// Assertions
			expect(response.statusCode).toBe(200); // Ensure status is 200
			expect(response.body.message).toBe("Event deleted successfully."); // Correct message
		});

		test("Fails when event is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] }); // Simulate no rows found

			const response = await request(app).delete("/api/event/delete/99");

			// Assertions
			expect(response.statusCode).toBe(404); // Ensure status is 404
			expect(response.body.message).toBe("Event not found."); // Correct message
		});
	});
});
