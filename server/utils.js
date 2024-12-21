// utils.js
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

module.exports = {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
};
