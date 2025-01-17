const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../mailtrap/emails");
const {generateTokenAndSetCookie} = require("../utils");
const jwt = require("jsonwebtoken");

require("dotenv").config();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const userExistsQuery = "SELECT * FROM users WHERE email = $1";
    const userExists = await pool.query(userExistsQuery, [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
 
    const insertUserQuery = `
      INSERT INTO users (name, email, password, is_verified, verification_code)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email
    `;
    const user = await pool.query(insertUserQuery, [name, email, hashedPassword, false, verificationCode]);
    const userId = user.rows[0].id;

    // const verificationToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // const verificationLink = `${process.env.BACKEND_URL}/api/emailverification/verify?token=${verificationCode}`;
    
    console.log("Verification Code :", verificationCode);
    generateTokenAndSetCookie(res, userId);

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      user: user.rows[0],
    });
  } catch (error) { 
    console.error("Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
