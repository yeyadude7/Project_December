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
				event_description: "A premier tech event",
				tags: "Technology, Networking",
				web_link: "https://techconference.com",
				start_time: "2024-12-20T10:00:00.000Z",
				end_time: "2024-12-20T18:00:00.000Z",
				photo_url: "https://example.com/photo.jpg",
				event_location: "Tech Hall",
				latitude: "40.7128",
				longitude: "-74.0060",
				organization: "Tech Org",
				source_url: "https://sourceurl.com",
				user_id: 1,
			});

			expect(response.statusCode).toBe(201);
			expect(response.body.event_name).toBe("Tech Conference");
		});

		test("Fails with missing required fields", async () => {
			const response = await request(app).post("/api/event/create").send({
				event_name: "Tech Conference",
			});

			expect(response.statusCode).toBe(400); // HandleBadRequestError
			expect(response.body.message).toBe("Missing required fields.");
		});

		test("Handles server error during creation", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).post("/api/event/create").send({
				event_name: "Tech Conference",
				event_type: 1,
				event_description: "A premier tech event",
				start_time: "2024-12-20T10:00:00.000Z",
				event_location: "Tech Hall",
			});

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
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

		test("Handles server error when retrieving all events", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/event/all");

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get Event by ID
	describe("GET /api/event/:id", () => {
		test("Successfully finds an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						event_id: 1,
						event_name: "Tech Conference",
					},
				],
			});

			const response = await request(app).get("/api/event/1");

			expect(response.statusCode).toBe(200);
			expect(response.body.event_name).toBe("Tech Conference");
		});

		test("Fails when the event does not exist", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/event/99");

			expect(response.statusCode).toBe(404); // HandleNotFoundError
			expect(response.body.message).toBe("Event not found.");
		});

		test("Handles server error when retrieving an event", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/event/1");

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Update Event
	describe("PUT /api/event/update/:id", () => {
		test("Successfully updates an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						event_id: 1,
						event_name: "Updated Conference",
					},
				],
			});

			const response = await request(app)
				.put("/api/event/update/1")
				.send({ event_name: "Updated Conference" });

			expect(response.statusCode).toBe(200);
			expect(response.body.event_name).toBe("Updated Conference");
		});

		test("Fails when event is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.put("/api/event/update/99")
				.send({ event_name: "Nonexistent Event" });

			expect(response.statusCode).toBe(404); // HandleNotFoundError
			expect(response.body.message).toBe("Event not found.");
		});

		test("Handles server error during update", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.put("/api/event/update/1")
				.send({ event_name: "Updated Conference" });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get Events RSVP'd by User
	describe("GET /api/event/rsvp/:user_id", () => {
		test("Successfully retrieves RSVP'd events", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						event_id: 1,
						event_name: "Tech Meetup",
					},
					{
						event_id: 2,
						event_name: "Coding Workshop",
					},
				],
			});

			const response = await request(app).get("/api/event/rsvp/1");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].event_name).toBe("Tech Meetup");
		});

		test("Fails when user has no RSVP'd events", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/event/rsvp/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe(
				"RSVP'd events for the user not found."
			);
		});

		test("Handles server error during RSVP retrieval", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/event/rsvp/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get Events for the Current Week
	describe("GET /api/event/week", () => {
		test("Successfully retrieves events for the current week", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						event_id: 1,
						event_name: "Weekly Standup",
						start_time: "2024-12-18T09:00:00.000Z",
						end_time: "2024-12-18T10:00:00.000Z",
					},
					{
						event_id: 2,
						event_name: "Tech Meetup",
						start_time: "2024-12-20T15:00:00.000Z",
						end_time: "2024-12-20T17:00:00.000Z",
					},
				],
			});

			const response = await request(app).get("/api/event/week");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].event_name).toBe("Weekly Standup");
			expect(response.body[1].event_name).toBe("Tech Meetup");
		});

		test("Handles no events for the current week", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/event/week");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe(
				"Events for the current week not found."
			);
		});

		test("Handles server error during retrieval of weekly events", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/event/week");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Get Events RSVP'd by User
	describe("GET /api/event/rsvp/:user_id", () => {
		test("Successfully retrieves RSVP'd events for a user", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{
						event_id: 1,
						event_name: "Tech Meetup",
					},
					{
						event_id: 2,
						event_name: "Hackathon",
					},
				],
			});

			const response = await request(app).get("/api/event/rsvp/1");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].event_name).toBe("Tech Meetup");
			expect(response.body[1].event_name).toBe("Hackathon");
		});

		test("Fails when user has no RSVP'd events", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/event/rsvp/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe(
				"RSVP'd events for the user not found."
			);
		});

		test("Handles server error during RSVP retrieval", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).get("/api/event/rsvp/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Delete Event
	describe("DELETE /api/event/delete/:id", () => {
		test("Successfully deletes an event", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ event_id: 1, event_name: "Tech Conference" }],
			});

			const response = await request(app).delete("/api/event/delete/1");

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Event deleted successfully.");
		});

		test("Fails when event is not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).delete("/api/event/delete/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("Event not found.");
		});

		test("Handles server error during deletion", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app).delete("/api/event/delete/1");

			expect(response.statusCode).toBe(500);
			expect(response.body.message).toBe("Server error");
		});
	});
});
