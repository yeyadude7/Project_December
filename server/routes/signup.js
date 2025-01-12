const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
require("dotenv").config();

// Mailtrap transporter setup

const transporter = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN
  })
);

// Signup Route
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

    const mailOptions = {
      from: "eventsAtUcf@example.com",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationCode}.`,
      html: `<p>Your verification code is <strong>${verificationCode}</strong>.</p>`,
    };

    await transporter.sendMail(mailOptions);

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


/*const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  try {
    // Check if the user already exists
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING id, name, email
    `;
    const insertValues = [name, email, hashedPassword];
    const insertResult = await pool.query(insertQuery, insertValues);

    const newUser = insertResult.rows[0];

    // Create a JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the response
    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
*/