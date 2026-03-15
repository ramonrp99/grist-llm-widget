class AppError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)

        this.success = false
        this.statusCode = statusCode
        this.details = details
    }
}

module.exports = AppError