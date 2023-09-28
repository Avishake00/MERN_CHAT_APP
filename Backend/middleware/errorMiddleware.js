//This middleware is responsible for handling cases where a requested route or endpoint does not exist in your application (i.e., a 404 Not Found error).
//then it calls next(error) to pass control to the next error-handling middleware or the default error handler.
const userNotFound = (req, res, next) => {
	const error = new Error(`Not Found -${req.originalUrl}`);
	res.status(404);
	next(error);
};

//This middleware is responsible for handling errors that occur during the processing of a request and sending an appropriate error response to the client.
//It first determines the appropriate HTTP status code based on the current response status code.
//If the response status code is 200 (OK),it sets the status code to 500 (Internal Server Error); otherwise, it keeps the existing status code.
const errorHandle = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.messgae,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};

module.exports = { userNotFound, errorHandle };
