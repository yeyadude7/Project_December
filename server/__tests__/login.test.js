const request = require("supertest");
const express = require("express");
const loginRouter = require("../routes/login");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../db");
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/login", loginRouter);

describe("Login Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test: Successful login
  describe("POST /api/login", () => {
    test("Successfully logs in a user", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "mockHashedPassword",
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // Mock user exists
      bcrypt.compare.mockResolvedValueOnce(true); // Mock password match
      jwt.sign.mockReturnValue("mockJwtToken"); // Mock JWT token

      const response = await request(app).post("/api/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBe("mockJwtToken");
      expect(response.body.user.email).toBe("john@example.com");
    });

    // Test: Invalid credentials
    test("Fails with invalid email", async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // No user found

      const response = await request(app).post("/api/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    test("Fails with invalid password", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "mockHashedPassword",
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // Mock user exists
      bcrypt.compare.mockResolvedValueOnce(false); // Mock password mismatch

      const response = await request(app).post("/api/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });

    // Test: Missing required fields
    test("Fails when email is missing", async () => {
      const response = await request(app).post("/api/login").send({
        password: "password123",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email and password are required");
    });

    test("Fails when password is missing", async () => {
      const response = await request(app).post("/api/login").send({
        email: "john@example.com",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email and password are required");
    });

    // Test: Server error
    test("Handles server error gracefully", async () => {
      db.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).post("/api/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Server error");
    });
  });
});
