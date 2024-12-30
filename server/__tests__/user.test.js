const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/user");
const db = require("../db");
const bcrypt = require("bcrypt");

jest.mock("../db");
jest.mock("bcrypt", () => ({
	hash: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);

describe("User Routes", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // Clear mocks before each test
	});

	// Test: Create user
	describe("POST /api/user/create", () => {
		test("Successfully creates a user", async () => {
			bcrypt.hash.mockResolvedValue("mockHashedPassword");
			db.query.mockResolvedValueOnce({
				rows: [{ id: 1, name: "John Doe", email: "john@example.com" }],
			});

			const response = await request(app).post("/api/user/create").send({
				name: "John Doe",
				email: "john@example.com",
				password: "password123",
				major: "Computer Science",
				goal: 1,
				photo: "https://example.com/photo.jpg",
				type_of_student: "Undergraduate",
				year: "Senior",
				group_preference: "Study Group",
			});

			expect(response.statusCode).toBe(200);
			expect(response.body.name).toBe("John Doe");
		});

		test("Fails when email already exists", async () => {
			db.query.mockRejectedValueOnce({ code: "23505" });

			const response = await request(app).post("/api/user/create").send({
				name: "Jane Doe",
				email: "existing@example.com",
				password: "password123",
			});

			expect(response.statusCode).toBe(409);
			expect(response.body.message).toBe("Email is already in use.");
		});

		test("Fails when required fields are missing", async () => {
			const response = await request(app).post("/api/user/create").send({
				email: "missingfields@example.com",
			});

			expect(response.statusCode).toBe(500);
		});
	});

	// Test: Update user
	describe("PUT /api/user/update/:id", () => {
		test("Successfully updates a user", async () => {
			const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
			db.query
				.mockResolvedValueOnce({ rows: [mockUser] }) // User exists
				.mockResolvedValueOnce({
					rows: [{ ...mockUser, name: "Updated Name" }],
				}); // Update result

			const response = await request(app)
				.put("/api/user/update/1")
				.send({ name: "Updated Name" });

			expect(response.statusCode).toBe(200);
			expect(response.body.name).toBe("Updated Name");
		});

		test("Fails when user not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] }); // No user found

			const response = await request(app).put("/api/user/update/99").send({
				name: "Nonexistent User",
			});

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User not found.");
		});
	});

	// Test: Change email
	describe("PUT /api/user/change-email/:id", () => {
		test("Successfully changes email", async () => {
			db.query.mockResolvedValueOnce({ rows: [{}] });

			const response = await request(app)
				.put("/api/user/change-email/1")
				.send({ email: "newemail@example.com" });

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("Email updated successfully.");
		});

		test("Fails when user not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] }); // No user found

			const response = await request(app)
				.put("/api/user/change-email/99")
				.send({ email: "missinguser@example.com" });

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User not found.");
		});
	});

	// Test: Get all users
	describe("GET /api/user/all", () => {
		test("Successfully retrieves all users", async () => {
			db.query.mockResolvedValueOnce({
				rows: [
					{ id: 1, name: "Alice", email: "alice@example.com" },
					{ id: 2, name: "Bob", email: "bob@example.com" },
				],
			});

			const response = await request(app).get("/api/user/all");

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveLength(2);
		});
	});

	// Test: Get user by ID
	describe("GET /api/user/:id", () => {
		test("Successfully retrieves a user by ID", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ id: 1, name: "Alice", email: "alice@example.com" }],
			});

			const response = await request(app).get("/api/user/1");

			expect(response.statusCode).toBe(200);
			expect(response.body.name).toBe("Alice");
		});

		test("Fails when user not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).get("/api/user/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User not found.");
		});
	});

	// Test: Delete user
	describe("DELETE /api/user/delete/:id", () => {
		test("Successfully deletes a user", async () => {
			db.query.mockResolvedValueOnce({
				rows: [{ id: 1, name: "Deleted User" }],
			});

			const response = await request(app).delete("/api/user/delete/1");

			expect(response.statusCode).toBe(200);
			expect(response.body.message).toBe("User deleted successfully.");
		});

		test("Fails when user not found", async () => {
			db.query.mockResolvedValueOnce({ rows: [] });

			const response = await request(app).delete("/api/user/delete/99");

			expect(response.statusCode).toBe(404);
			expect(response.body.message).toBe("User not found.");
		});
	});
});