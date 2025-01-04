const request = require("supertest");
const express = require("express");
const aiSearchRouter = require("../routes/AiSearch");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(express.json());
app.use("/api/ai-search", aiSearchRouter);

describe("AI Search Routes with Real API Calls", () => {
  beforeAll(() => {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in the environment.");
    }
  });

  test("Successfully redirects to friend search", async () => {
    const response = await request(app).get("/api/ai-search").query({
      prompt: "Find friends who are Computer Science majors",
      user_id: 1,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/api/friend/Aisearch");
  });

  test("Handles missing prompt or user_id", async () => {
    const response = await request(app).get("/api/ai-search").query({
      prompt: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Prompt and user_id are required.");
  });

  test("Handles invalid search type", async () => {
    const response = await request(app).get("/api/ai-search").query({
      prompt: "Search something invalid",
      user_id: 1,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid search type");
  });
});
