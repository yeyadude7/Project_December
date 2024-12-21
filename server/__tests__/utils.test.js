const {
	handleServerError,
	handleNotFoundError,
	handleBadRequestError,
} = require("../utils");

describe("Utils - Error Handlers", () => {
	// Mock the response object
	let res;

	beforeEach(() => {
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	// Test: handleServerError
	describe("handleServerError", () => {
		test("should respond with status 500 and correct error message", () => {
			const mockError = new Error("Test server error");

			handleServerError(res, mockError);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				message: "Server error",
				details: "Test server error",
			});
		});
	});

	// Test: handleNotFoundError
	describe("handleNotFoundError", () => {
		test("should respond with status 404 and correct entity message", () => {
			const entity = "Event";

			handleNotFoundError(res, entity);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({
				message: "Event not found.",
			});
		});
	});

	// Test: handleBadRequestError
	describe("handleBadRequestError", () => {
		test("should respond with status 400 and correct message", () => {
			const message = "Invalid input";

			handleBadRequestError(res, message);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				message: "Invalid input",
			});
		});
	});
});
