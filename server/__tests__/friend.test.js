const request = require("supertest");
const express = require("express");
const friendRouter = require("../routes/friend");
const db = require("../db");

jest.mock("../db"); // Mock database for testing

const app = express();
app.use(express.json());
app.use("/api/friends", friendRouter);

describe("Friend Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	// Test: Send Friend Request
	describe("POST /api/friends/request", () => {
		test("Successfully sends a friend request", async () => {
			db.query
				.mockResolvedValueOnce({ rows: [] }) // Check for existing relationship
				.mockResolvedValueOnce({}); // Insert new request

			const response = await request(app)
				.post("/api/friends/request")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(201);
			expect(response.body.message).toBe("Friend request sent successfully.");
		});

		test("Fails when required fields are missing", async () => {
			const response = await request(app).post("/api/friends/request").send({});

			expect(response.statusCode).toBe(400); // HandleBadRequestError
			expect(response.body.message).toBe(
				"Both user1_id and user2_id are required."
			);
		});

		test("Fails when a request already exists", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user1_id: 1, user2_id: 2 }],
			});

			const response = await request(app)
				.post("/api/friends/request")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(400); // HandleBadRequestError
			expect(response.body.message).toBe(
				"A friendship request already exists or is pending."
			);
		});

		test("Handles server error during request creation", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.post("/api/friends/request")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Accept Friend Request
	describe("PUT /api/friends/accept", () => {
		test("Successfully accepts a friend request", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user1_id: 1, user2_id: 2, status: "accepted" }],
			});

			const response = await request(app)
				.put("/api/friends/accept")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Friend request accepted.");
		});

		test("Fails when no pending request exists", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.put("/api/friends/accept")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(404); // HandleNotFoundError
			expect(response.body.message).toBe("Friend request not found.");
		});

		test("Handles server error during acceptance", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.put("/api/friends/accept")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: Reject Friend Request
	describe("PUT /api/friends/reject", () => {
		test("Successfully rejects a friend request", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ user1_id: 1, user2_id: 2 }],
			});

			const response = await request(app)
				.put("/api/friends/reject")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Friend request rejected.");
		});

		test("Fails when no pending request exists", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app)
				.put("/api/friends/reject")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(404); // HandleNotFoundError
			expect(response.body.message).toBe("Friend request not found.");
		});

		test("Handles server error during rejection", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.put("/api/friends/reject")
				.send({ user1_id: 1, user2_id: 2 });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: List Friend Requests
	describe("GET /api/friends/requests", () => {
		test("Successfully lists friend requests", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user1_id: 1, user2_id: 2, status: "pending" },
					{ user1_id: 3, user2_id: 2, status: "pending" },
				],
			});

			const response = await request(app)
				.get("/api/friends/requests")
				.query({ user_id: 2 });

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].status).toBe("pending");
		});

		test("Fails when user_id is missing", async () => {
			const response = await request(app).get("/api/friends/requests");

			expect(response.statusCode).toBe(400); // HandleBadRequestError
			expect(response.body.message).toBe("user_id is required.");
		});

		test("Handles server error during request listing", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.get("/api/friends/requests")
				.query({ user_id: 2 });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	// Test: List Friends
	describe("GET /api/friends", () => {
		test("Successfully lists friends", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ user1_id: 1, user2_id: 2, status: "accepted" },
					{ user1_id: 2, user2_id: 3, status: "accepted" },
				],
			});

			const response = await request(app)
				.get("/api/friends")
				.query({ user_id: 2 });

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0].status).toBe("accepted");
		});

		test("Fails when user_id is missing", async () => {
			const response = await request(app).get("/api/friends");

			expect(response.statusCode).toBe(400); // HandleBadRequestError
			expect(response.body.message).toBe("user_id is required.");
		});

		test("Handles server error during friend listing", async () => {
			db.query.mockRejectedValueOnce(new Error("Database error"));

			const response = await request(app)
				.get("/api/friends")
				.query({ user_id: 2 });

			expect(response.statusCode).toBe(500); // HandleServerError
			expect(response.body.message).toBe("Server error");
		});
	});

	describe("GET /api/friends/Aisearch", () => {
		test("Successfully searches for friends or users", async () => {
		  db.query.mockResolvedValueOnce({
			rows: [
			  { id: 1, name: "John Doe", email: "john@example.com" },
			  { id: 2, name: "Jane Doe", email: "jane@example.com" },
			],
		  });
	
		  const response = await request(app)
			.get("/api/friends/Aisearch")
			.query({ query: "Doe", user_id: 1 });
	
		  expect(response.statusCode).toBe(200);
		  expect(response.body).toHaveLength(2);
		  expect(response.body[0].name).toBe("John Doe");
		});
	
		test("Fails when user_id is missing", async () => {
		  const response = await request(app)
			.get("/api/friends/Aisearch")
			.query({ query: "Doe" });
	
		  expect(response.statusCode).toBe(400); // HandleBadRequestError
		  expect(response.body.message).toBe("user_id is required.");
		});
	
		test("Handles server error during search", async () => {
		  db.query.mockRejectedValueOnce(new Error("Database error"));
	
		  const response = await request(app)
			.get("/api/friends/Aisearch")
			.query({ query: "Doe", user_id: 1 });
	
		  expect(response.statusCode).toBe(500); // HandleServerError
		  expect(response.body.message).toBe("Server error");
		});
	  });
	
	  // Test: Search Users (search route)
	  describe("GET /api/friends/search", () => {
		test("Successfully searches for users by name or email", async () => {
		  db.query.mockResolvedValueOnce({
			rows: [
			  { id: 1, name: "John Doe", email: "john@example.com" },
			  { id: 2, name: "Jane Doe", email: "jane@example.com" },
			],
		  });
	
		  const response = await request(app)
			.get("/api/friends/search")
			.query({ query: "Doe", user_id: 1 });
	
		  expect(response.statusCode).toBe(200);
		  expect(response.body).toHaveLength(2);
		  expect(response.body[0].name).toBe("John Doe");
		});
	
		test("Fails when query is missing", async () => {
		  const response = await request(app)
			.get("/api/friends/search")
			.query({ user_id: 1 });
	
		  expect(response.statusCode).toBe(400); // HandleBadRequestError
		  expect(response.body.message).toBe("Search query is required.");
		});
	
		test("Fails when user_id is missing", async () => {
		  const response = await request(app)
			.get("/api/friends/search")
			.query({ query: "Doe" });
	
		  expect(response.statusCode).toBe(400); // HandleBadRequestError
		  expect(response.body.message).toBe("user_id is required.");
		});
	
		test("Handles server error during search", async () => {
		  db.query.mockRejectedValueOnce(new Error("Database error"));
	
		  const response = await request(app)
			.get("/api/friends/search")
			.query({ query: "Doe", user_id: 1 });
	
		  expect(response.statusCode).toBe(500); // HandleServerError
		  expect(response.body.message).toBe("Server error");
		});
	  });
});
