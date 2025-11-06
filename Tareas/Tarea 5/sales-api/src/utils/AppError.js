class AppError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;