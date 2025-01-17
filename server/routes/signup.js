const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const { sendVerificationEmail } = require("../mailtrap/emails");
const { generateTokenAndSetCookie } = require("../utils");

router.post("/", async (req, res) => {
  const {
    name,
    email,
    password,
    major,
    goal,
    photo,
    type_of_student,
    year,
    group_preference,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  try {
    const userExistsQuery = "SELECT * FROM users WHERE email = $1";
    const userExists = await pool.query(userExistsQuery, [email]);

    if (userExists.rows.length > 0) {
      const user = userExists.rows[0];

      if (!user.is_verified) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const updateVerificationQuery = `
          UPDATE users SET verification_code = $1 WHERE email = $2
          RETURNING id, name, email
        `;
        await pool.query(updateVerificationQuery, [verificationCode, email]);

        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
          success: true,
          message: "Verification email sent again. Please verify your email.",
        });
      } else {
        const updateUserQuery = `
          UPDATE users 
          SET 
            major = $1, 
            goal = $2, 
            photo = $3, 
            type_of_student = $4, 
            year = $5, 
            group_preference = $6
          WHERE email = $7
          RETURNING *`;

        const updatedUser = await pool.query(updateUserQuery, [
          major,
          goal,
          photo,
          type_of_student,
          year,
          group_preference,
          email,
        ]);

        return res.status(200).json({
          success: true,
          message: "Profile updated successfully.",
          user: updatedUser.rows[0],
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      const insertUserQuery = `
        INSERT INTO users (name, email, password, is_verified, verification_code)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email
      `;
      const user = await pool.query(insertUserQuery, [name, email, hashedPassword, false, verificationCode]);
      const userId = user.rows[0].id;

      console.log("Verification Code:", verificationCode);
      generateTokenAndSetCookie(res, userId);

      await sendVerificationEmail(email, verificationCode);

      return res.status(201).json({
        success: true,
        message: "Signup successful. Please verify your email.",
        user: user.rows[0],
      });
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
