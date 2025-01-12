const jwt = require("jsonwebtoken");

const handleServerError = (res, err) => {
	console.error(err.message);
	res.status(500).json({ message: "Server error", details: err.message });
};

const handleNotFoundError = (res, entity) => {
	res.status(404).json({ message: `${entity} not found.` });
};

const handleBadRequestError = (res, message) => {
	res.status(400).json({ message });
};

const generateTokenAndSetCookie = (res, userId)=>{
	const token = jwt.sign({userId}, process.env.JWT_SECRET, {
		expiresIn: "7d"
	});
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7*24*60*60*1000,
	})
	return token; 
}
module.exports = {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
	generateTokenAndSetCookie
};
