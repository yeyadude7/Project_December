const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "Email and verification code are required" });
  }

  try {
    // Check if the code matches the one in the database
    const query = "SELECT * FROM users WHERE email = $1 AND verification_code = $2";
    const result = await pool.query(query, [email, code]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    // Mark user as verified
    const updateQuery = "UPDATE users SET is_verified = true, verification_code = NULL WHERE email = $1";
    await pool.query(updateQuery, [email]);

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
