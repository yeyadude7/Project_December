const request = require("supertest");
const express = require("express");
const eventRouter = require("../routes/event");
const db = require("../db");

jest.mock("../db"); // Mock database for testing


const app = express();
app.use(express.json());
app.use("/api/event", eventRouter);

let server;

beforeAll(() => {
  server = app.listen(3000); // Start the server before tests
});

afterAll(() => {
	server.close(); // Close the server after tests
  });

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
				tags: "Technology, Networking",
				web_link: "https://techconference.com",
				start_time: "2024-12-20T10:00:00.000Z",
				end_time: "2024-12-20T18:00:00.000Z",
				photo_url: "https://example.com/photo.jpg",
				location: "Tech Hall",
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
				start_time: "2024-12-20T10:00:00.000Z",
				location: "Tech Hall",
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
				rows: [{ event_id: 1, event_name: "Updated Conference" }],
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

	// Test: Handle RSVP
// Test: Handle RSVP
describe("POST /api/event/rsvp", () => {
    test("Successfully processes RSVP", async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ did_rsvp: false }],
      }).mockResolvedValueOnce({
        rows: [{ event_id: 1 }],
      });

      const response = await request(app).post("/api/event/rsvp").send({
        user_id: 1,
        event_id: 1,
        did_rsvp: true
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("RSVP processed successfully.");
    });
  });

  // Test: Search Events
  describe("GET /api/event/search", () => {
    test("Successfully searches events by query and tags", async () => {
      // Mock database response
      db.query.mockResolvedValueOnce({
        rows: [
          { event_name: "Tech Conference", tags: "Technology, Networking" },
          { event_name: "Art Exhibition", tags: "Art, Culture" },
        ],
      });

      console.log("Mock Response:", db.query.mock.calls);

      // Send the request with query parameters
      const response = await request(app).get("/api/event/search").query({
        query: "Tech",         // Search for "Tech"
        tags: "Technology"    // Filter by tag "Technology"
      });

      console.log("Response Body:", JSON.stringify(response.body, null, 2));

      // Check the response
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1); // Only 1 event matches the search
      expect(response.body[0].event_name).toBe("Tech Conference"); // Verify the event name
    });
  });
});
  
