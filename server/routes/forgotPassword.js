const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const { sendForgotPasswordEmail } = require("../mailtrap/emails");

router.post("/request-reset", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }

    // const user = userResult.rows[0];
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const updateCodeQuery = "UPDATE users SET reset_code = $1 WHERE email = $2";
    await pool.query(updateCodeQuery, [resetCode, email]);

    console.log("Reset code:", resetCode);
    await sendForgotPasswordEmail(email, resetCode);

    res.status(200).json({ success: true, message: "Password reset code sent to email" });
  } catch (error) {
    console.error("Error requesting password reset:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, reset code, and new password are required" });
  }

  try {
    const userQuery = "SELECT * FROM users WHERE email = $1 AND reset_code = $2";
    const userResult = await pool.query(userQuery, [email, resetCode]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid reset code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePasswordQuery = "UPDATE users SET password = $1, reset_code = NULL WHERE email = $2";
    await pool.query(updatePasswordQuery, [hashedPassword, email]);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;