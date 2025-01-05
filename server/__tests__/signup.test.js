const request = require("supertest");
const express = require("express");
const signupRouter = require("../routes/signup");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../db");
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/signup", signupRouter);

describe("Signup Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test: Successful signup
  describe("POST /api/signup", () => {
    test("Successfully signs up a new user", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      db.query.mockResolvedValueOnce({ rows: [] }); // No user exists
      bcrypt.hash.mockResolvedValueOnce("mockHashedPassword"); // Mock hashed password
      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // Mock user insertion
      jwt.sign.mockReturnValue("mockJwtToken"); // Mock JWT token

      const response = await request(app).post("/api/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signup successful");
      expect(response.body.token).toBe("mockJwtToken");
      expect(response.body.user.email).toBe("john@example.com");
    });

    // Test: Missing required fields
    test("Fails when name is missing", async () => {
      const response = await request(app).post("/api/signup").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Name, email, and password are required");
    });

    test("Fails when email is missing", async () => {
      const response = await request(app).post("/api/signup").send({
        name: "John Doe",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Name, email, and password are required");
    });

    test("Fails when password is missing", async () => {
      const response = await request(app).post("/api/signup").send({
        name: "John Doe",
        email: "john@example.com",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Name, email, and password are required");
    });

    // Test: Email already in use
    test("Fails when email is already in use", async () => {
      const existingUser = {
        id: 1,
        name: "Existing User",
        email: "john@example.com",
      };

      db.query.mockResolvedValueOnce({ rows: [existingUser] }); // Mock user exists

      const response = await request(app).post("/api/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email already in use");
    });

    // Test: Server error
    test("Handles server error gracefully", async () => {
      db.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).post("/api/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Server error");
    });
  });
});
