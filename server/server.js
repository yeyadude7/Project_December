const pool = require("./db");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.SERVER_PORT;

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//
app.use("/api/user", require("./routes/user"));
app.use("/api/event", require("./routes/event"));
app.use("/api/interest", require("./routes/interest"));
app.use("/api/friend", require("./routes/friend"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signup", require("./routes/signup"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/aisearch", require("./routes/aiSearch"));

// Server listening Result
app.listen(PORT, () => {
	console.log(`Enviornment is in ${process.env.NODE_ENV} mode.`);
	console.log(`Server running at http://localhost:${PORT}/`);
});

app.get("/api/test-db", async (req, res) => {
	try {
		const result = await pool.query("SELECT NOW()");
		res.status(200).json({ success: true, time: result.rows[0] });
	} catch (error) {
		console.error("Database connection error:", error.message);
		res.status(500).json({
			success: false,
			message: "Database connection failed",
		});
	}
});
