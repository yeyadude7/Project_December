const { transport, sender } = require('./mailtrap.config');

exports.sendVerificationEmail = async (email, verificationCode) => {
    const recipient = [email];
    try {
        const response = transport.sendMail({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: `<html>Verify your email for eventsAtUcf access. The code expires in 10 minutes - ${verificationCode}</html>`,
            category: "Email Verification",
        });
        console.log("Sending verification email to:", email);
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};


exports.forgotPasswordEmail = async (email, resetToken) => {
    const resetLink = `http://yourdomain.com/reset-password?token=${resetToken}`;
    const recipient = [email];
    try {
        const response = transport.sendMail({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            text: `Click the link to reset your password: ${resetLink}`,
            category: "Password Reset",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error resetting password`, error);
        throw new Error(`Error sending verification code for resetting password: ${error}`);
    }
};