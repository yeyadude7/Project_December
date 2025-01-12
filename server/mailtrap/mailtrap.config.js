const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: './server/.env' });


const TOKEN = process.env.MAILTRAP_TOKEN;

if (!TOKEN) {
  console.error("MAILTRAP_TOKEN is undefined. Please check your .env file.");
  process.exit(1); // Exit the process if the token is not set
}

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "eventsAtUcf@demomailtrap.com", // Fixed extra space in the email address
  name: "EventsAtUcf",
};

module.exports = { transport, sender }; 