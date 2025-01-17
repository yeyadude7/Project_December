const { transport, sender } = require('./mailtrap.config');

// Send verification email
exports.sendVerificationEmail = async (email, verificationCode) => {
  const recipient = [email];
  try {
    const response = await transport.sendMail({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: `<html>
        <p>Thank you for signing up for EventsAtUCF!</p>
        <p>Your email verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Please enter this code on the website to verify your email. The code expires in 1 hour.</p>
      </html>`,
      category: "Email Verification",
    });
    console.log("Sending verification email to:", email);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

// Send password reset email
exports.sendForgotPasswordEmail = async (email, resetCode) => {
  const recipient = [email];
  try {
    const response = await transport.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Reset Request",
      html: `<html>
        <p>We received a request to reset your password.</p>
        <p>Your password reset code is:</p>
        <h2>${resetCode}</h2>
        <p>Please enter this code on the website to reset your password. The code expires in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </html>`,
      category: "Password Reset",
    });
    console.log("Sending password reset email to:", email);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};
